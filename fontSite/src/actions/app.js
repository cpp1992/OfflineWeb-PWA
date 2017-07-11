export const APP_ONLINE = 'APP_ONLINE';
export const APP_PWA_HISTORY = 'APP_PWA_HISTORY';

export const appInit = () => (
	(dispatch) => {
		function doDispatch(online) {
			dispatch({
				type: APP_ONLINE,
				online,
			});

			if (!online || true) {
				fetch('/api/item/offline')
					.then(res => res.json())
					.then(({ list }) => {
						dispatch({
							type: APP_PWA_HISTORY,
							list,
						});
					}).catch((err) => {
						console.warn('OPS!!!', err);
					});
			}
		}

		fetch('/api/online').then((res) => {
			doDispatch(res.ok);
		}).catch(() => {
			doDispatch(false);
		});
	}
);
