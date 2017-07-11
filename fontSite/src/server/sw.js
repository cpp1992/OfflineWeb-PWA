const CACHE_NAME = 'offline_web';
const ITEM_REGEX = /\/api\/item\/(.*)/;

function cloneFetch(promise) {
	return promise.then(res => res.clone());
}

// URL
function parseURL(url = '') {
	const match = url.match(/^(https?:)\/\/([^/]+)(\/.*)?/);
	return {
		protocol: match[1],
		host: match[2],
		pathname: match[3],
	};
}

// Web database
const databasePromise = new Promise((resolve, reject) => {
	const DBRquest = indexedDB.open(CACHE_NAME);
	DBRquest.onerror = (event) => {
		console.log('[SW] Database error:', event.target.errorCode);
		reject(event.target.errorCode);
	};
	DBRquest.onsuccess = (event) => {
		console.log('[SW] Database open success');
		resolve(event.target.result);
	};
	DBRquest.onupgradeneeded = (event) => {
		const db = event.target.result;
		db.createObjectStore('items', { keyPath: 'id' });
		console.log('[SW] Database upgrade');
		resolve(db);
	};
});


function saveItem(item) {
	databasePromise.then((db) => {
		const transaction = db.transaction('items', 'readwrite');
		const store = transaction.objectStore('items');

		transaction.onerror = (event) => {
			console.log('[SW - DB] Warn:', event);
		};
		transaction.onabort = (event) => {
			console.log('[SW - DB] Abort:', event);
		};

		store.add(item).onsuccess = () => {
			console.log('[SW - DB] Save in DB:', item);
		};
	});
}

function getItems() {
	return new Promise((resolve, reject) => {
		databasePromise.then((db) => {
			const transaction = db.transaction('items', 'readwrite');
			const store = transaction.objectStore('items');
			const getAll = store.getAll();
			getAll.onsuccess = (event) => {
				resolve(event.target.result || []);
			};
			getAll.onerror = (event) => {
				reject(event);
			};
		});
	});
}

// PWA
self.addEventListener('install', (event) => {
	console.log('[SW] Install...');
	event.waitUntil(
		caches.open(CACHE_NAME).then(self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
	console.log('[SW] active...');
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	console.log('[SW] Request:', request);

	// ================================================
	// =                 Proxy Handle                 =
	// ================================================
	// Ignore dev request
	if (
		/webpack/.test(request.url) ||
		!/^http/.test(request.url)
	) return;

	// Proxy fetch
	const location = parseURL(request.url);
	const fetched = fetch(request, { cache: 'no-store' });
	const fetchedClone = cloneFetch(fetched);

	const itemMatch = location.pathname.match(ITEM_REGEX);
	if (itemMatch) {
		if (itemMatch[1] === 'offline') {
			// Handle offline api request
			event.respondWith(getItems().then(list => (
				new Response(JSON.stringify({ list }))
			)));
			return;
		} else if (/^\d+$/.test(itemMatch[1])) {
			// Save visited item in Database
			cloneFetch(fetched)
				.then(res => res.json())
				.then((item) => {
					saveItem(item);
				});
		}
	}


	event.respondWith(fetched.catch(() => {
		console.log('Fetch error:', request.url);
		return caches.match(request);
	}));

	// Put into cache
	Promise.all([fetchedClone, caches.open(CACHE_NAME)])
		.then(([res, cache]) => {
			if (
				!res.ok ||
				/online/.test(request.url) ||
				/hot-update/.test(request.url)
			) return;

			// const clone = res.clone();
			cache.put(request, res);

			// return clone.text();
		// }).then((txt) => {
			// console.log('Save Cache:', request.url, '- length:', txt.length);
		});
});
