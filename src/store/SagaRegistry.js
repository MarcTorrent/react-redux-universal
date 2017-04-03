import createSagaMiddleware from 'redux-saga';

export default class SagaRegistry {
	constructor(mainSaga) {
		// sagas should be an object of the form:
		// {sagaName: sagaFunctionGenerator}
		this._mainSaga = mainSaga;
		this._emitChange = null;
		this._sagaMiddleware = createSagaMiddleware();
	}

	register(newSagas) {
		if (this._emitChange != null) {
			this._emitChange(newSagas);
		}
	}

	getSagaMiddleware() {
		return this._sagaMiddleware;
	}

	getMainSaga() {
		return this._mainSaga;
	}

	setChangeListener(listener) {
		if (this._emitChange != null) {
			throw new Error('Can only set the listener for a SagaRegistry once.');
		}

		if (typeof listener !== 'function') {
			throw new Error('The listener must be a valid function.');
		}

		this._emitChange = listener;
	}
}
