import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import configureReducers from './configureReducers';
import { REGISTER_NEW_SAGAS } from '../App/actions/types';

export default function configureStore(initialState = {}, reducerRegistry, sagaRegistry) {
	const rootReducer = configureReducers(reducerRegistry.getReducers());
	const mainSaga = sagaRegistry.getMainSaga();
	const sagaMiddleware = sagaRegistry.getSagaMiddleware();

	let middleware = [ thunkMiddleware, sagaMiddleware ];
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

	sagaMiddleware.run(mainSaga);

	reducerRegistry.setChangeListener((reducers) => {
		store.replaceReducer(configureReducers(reducers));
	});

	sagaRegistry.setChangeListener((sagas) => {
		store.dispatch({type: REGISTER_NEW_SAGAS, payload: sagas});
	});

	return store;
}
