import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import $ from 'jquery';
import Perf from 'react-addons-perf';

import app from 'reducers';
import Main from 'views/Main';

// =======================================================
// =                      Poly Fill                      =
// =======================================================

// =======================================================
// =                     Application                     =
// =======================================================
const loggerMiddleware = createLogger({
	collapsed: true,
});
const store = createStore(
	app,
	applyMiddleware(thunkMiddleware, loggerMiddleware),
);

window.$ = $;
window.Perf = Perf;

Object.defineProperties(window, {
	store: {
		get() {
			return store.getState();
		},
	},
});

require('admin-lte/bootstrap/css/bootstrap.css');
require('admin-lte/dist/css/AdminLTE.css');
require('admin-lte/dist/css/skins/skin-blue.css');
require('font-awesome/css/font-awesome.css');
require('bdp-components/dist/css/bdp-component.css');

require('style/index.scss');

require('bootstrap/dist/js/npm.js');

// Render & Hot Update
delete AppContainer.prototype.unstable_handleError;
render(
	<AppContainer>
		<HashRouter>
			<Provider store={store}>
				<Main />
			</Provider>
		</HashRouter>
	</AppContainer>,
	document.getElementById('root'),
);

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept('views/Main', () => {
		const NextMain = require('views/Main').default;
		render(
			<AppContainer>
				<HashRouter>
					<Provider store={store}>
						<NextMain />
					</Provider>
				</HashRouter>
			</AppContainer>,
			document.getElementById('root'),
		);

		setTimeout(() => {
			$(window).resize();
		});
	});
}

require('admin-lte/dist/js/app.min.js');
