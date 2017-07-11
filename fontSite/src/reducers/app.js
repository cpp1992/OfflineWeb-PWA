import * as AppAction from 'actions/app';

const initState = {
	online: false,
	pwa_list: [],
};

export default (state = initState, action) => {
	switch (action.type) {
		case AppAction.APP_ONLINE:
			return Object.assign({}, state, { online: action.online });
		case AppAction.APP_PWA_HISTORY:
			return Object.assign({}, state, { pwa_list: action.list });
	}
	return state;
};
