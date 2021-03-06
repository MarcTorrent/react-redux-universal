import 'babel-polyfill';
import { trigger } from 'redial';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, match, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import ReducerRegistry from './store/ReducerRegistry';
import SagaRegistry from './store/SagaRegistry';
import coreReducers from './App/reducers/';
import mainSaga from './App/sagas/';
import authSaga from './App/sagas/auth';
import * as constants from './constants';
import * as resources from './plugins/resources';
import { USER_AUTHENTICATED } from './App/actions/types';

const reducerRegistry = new ReducerRegistry(coreReducers);
const sagaRegistry = new SagaRegistry(mainSaga);

let render = () => {

	const initialState = window.INITIAL_STATE || {};
	const store = configureStore(initialState, reducerRegistry, sagaRegistry);
	// Now, configure the core sagas that will always be part of the core bundle
	sagaRegistry.register({'authSaga': authSaga});
	// We need to have a root route for HMR to work.
	const configureRoutes = require('./routes').default;
	const routes = configureRoutes(reducerRegistry, sagaRegistry);

	const { dispatch } = store;
	const { pathname, search, hash } = window.location;
	const location = `${pathname}${search}${hash}`;
	const container = document.getElementById(constants.ROOT_ELEMENT);

	const token = resources.getCookie(constants.AUTH_COOKIE);
	if (token) {
		dispatch({
			type: USER_AUTHENTICATED
		});
	}

	// Pull child routes using match. Adjust Router for vanilla webpack HMR,
	// in development using a new key every time there is an edit.
	match({ routes, location }, () => {
		// Render app with Redux and router context to container element.
		// We need to have a random in development because of `match`'s dependency on
		// `routes.` Normally, we would want just one file from which we require `routes` from.
		ReactDOM.render(
			<Provider store={store}>
				<Router routes={routes} history={browserHistory} key={Math.random()}/>
			</Provider>,
			container
		);

	});

	// For redial use
	browserHistory.listen(location => {
		// Match routes based on location object:
		match({ routes, location }, (error, redirectLocation, renderProps) => {
			// Get array of route handler components:
			const { components } = renderProps;
			// Define locals to be provided to all lifecycle hooks:
			const locals = {
				path: renderProps.location.pathname,
				query: renderProps.location.query,
				params: renderProps.params,

				// Allow lifecycle hooks to dispatch Redux actions:
				dispatch,
			};
			// Fetch mandatory data dependencies for 2nd route change onwards:
			trigger('fetch', components, locals);
		});
	});
};

// Configure hot module replacement for core reducers and routes
if (process.env.NODE_ENV !== 'production') {
	if (module.hot) {
		module.hot.accept('./App/reducers/', () => {
			reducerRegistry.register(require('./App/reducers/'));
		});
		module.hot.accept('./routes', () => {
			setTimeout(render);
		});
	}
}

render();
