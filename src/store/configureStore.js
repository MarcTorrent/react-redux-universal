import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import configureReducers from './configureReducers';

export default function configureStore(initialState = {}, reducerRegistry) {
	const rootReducer = configureReducers(reducerRegistry.getReducers());

	let middleware = [ thunkMiddleware ];
	if (process.env.NODE_ENV !== 'production' && (typeof window !== 'undefined')) {
		const createLogger = require('redux-logger');
		middleware.push(createLogger());
	}
	let store = createStore(rootReducer, initialState, compose(
		applyMiddleware(...middleware),

		(process.env.NODE_ENV === 'local') &&
		typeof window === 'object' &&
		typeof window.devToolsExtension !== 'undefined' ?
		window.devToolsExtension() : f => f
	));

	reducerRegistry.setChangeListener((reducers) => {
		store.replaceReducer(configureReducers(reducers));
	});

	return store;
}
