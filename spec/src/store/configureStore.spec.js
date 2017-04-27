import { expect } from 'chai';
import sinon from 'sinon';

import * as redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as configureReducers from '../../../src/store/configureReducers';
import configureStore from '../../../src/store/configureStore';

describe('Configure store', function() {
	let store;
	let reducers;
	let reducerRegistry;
	let sagaRegistry;
	let mainSaga;
	let sagaMiddlewareInstance;

	function sagaMiddleware() {
		return next => action => {};
	}
	sagaMiddleware.run = () => {};
	const sagaMiddlewareFactory = function() {
		return sagaMiddleware;
	};

	const wrapperSagaMiddleware = function() {
		return sagaMiddlewareInstance;
	};

	beforeEach(function() {
		reducers = {
			reducer1: sinon.stub().returns({}),
			reducer2: sinon.stub().returns({})
		};

		mainSaga = function* mainSaga() {};

		reducerRegistry = {
			getReducers: sinon.stub().returns(reducers),
			setChangeListener: sinon.spy()
		};

		sagaMiddlewareInstance = sagaMiddlewareFactory();

		sagaRegistry = {
			getSagaMiddleware: wrapperSagaMiddleware,
			getMainSaga: sinon.stub().returns(mainSaga),
			setChangeListener: sinon.stub().returns({})
		};
	});

	it('Should configure the root reducers', function() {
		sinon.spy(configureReducers, 'default');

		store = configureStore(undefined, reducerRegistry, sagaRegistry);
		expect(reducerRegistry.getReducers.callCount).to.equal(1);
		expect(configureReducers.default.callCount).to.equal(1);
		expect(configureReducers.default.calledWith(reducers)).to.equal(true);

		configureReducers.default.restore();
	});

	xit('Should build the correct middleware', function() {
		sinon.stub(redux, 'applyMiddleware');

		store = configureStore(undefined, reducerRegistry, sagaRegistry);
		expect(redux.applyMiddleware.callCount).to.equal(1);
		console.log(redux.applyMiddleware.getCalls()[0].args[1]);
		console.log(sagaMiddlewareInstance);
		expect(redux.applyMiddleware.calledWith([thunkMiddleware, sagaRegistry.getSagaMiddleware])).to.equal(true);

		redux.applyMiddleware.restore();
	});

	it('Should create the store object', function() {
		sinon.spy(redux, 'createStore');

		store = configureStore(undefined, reducerRegistry, sagaRegistry);
		expect(redux.createStore.callCount).to.equal(1);
		expect(store).to.exist;

		redux.createStore.restore();
	});

	it('Should set the change listener for the reducer registry', function() {
		sinon.spy(configureReducers, 'default');

		store = configureStore(undefined, reducerRegistry, sagaRegistry);
		expect(configureReducers.default.callCount).to.equal(1);
		expect(reducerRegistry.setChangeListener.callCount).to.equal(1);
		expect(reducerRegistry.setChangeListener.lastCall.args).to.have.lengthOf(1);
		expect(reducerRegistry.setChangeListener.lastCall.args[0]).to.be.a('function');

		sinon.stub(store, 'replaceReducer');

		reducerRegistry.setChangeListener.lastCall.args[0](reducers);
		expect(store.replaceReducer.callCount).to.equal(1);
		expect(store.replaceReducer.lastCall.args[0]).to.be.a('function');
		expect(configureReducers.default.callCount).to.equal(2);
		expect(configureReducers.default.lastCall.args[0]).to.deep.equal(reducers);

		store.replaceReducer.restore();
		configureReducers.default.restore();
	});
});
