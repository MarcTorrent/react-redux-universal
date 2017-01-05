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

	const composeEnhancers =
		process.env.NODE_ENV !== 'production' &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

	const store = createStore(rootReducer, initialState, composeEnhancers(
		applyMiddleware(...middleware)
	));

	reducerRegistry.setChangeListener((reducers) => {
		store.replaceReducer(configureReducers(reducers));
	});

	return store;
}
