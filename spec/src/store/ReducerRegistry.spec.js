import { expect } from 'chai';
import sinon from 'sinon';

import ReducerRegistry from '../../../src/store/ReducerRegistry';

describe('Reducer Registry', function() {
	let reducerRegistry;
	let initialReducers;

	beforeEach(function() {
		initialReducers = { reducer1: sinon.spy(), reducer2: sinon.spy() };
	});

	it('Should exist', function() {
		expect(ReducerRegistry).to.exist;
		expect(ReducerRegistry).to.be.a('function');
	});

	it('Should be able to create a new instance with default properties', function() {
		reducerRegistry = new ReducerRegistry();

		expect(reducerRegistry).to.exist;
		expect(reducerRegistry).to.be.an('object');
		expect(reducerRegistry._reducers).to.deep.equal({});
		expect(reducerRegistry._emitChange).to.equal(null);
	});

	it('Should be able to create a new instance with initialized properties', function() {
		reducerRegistry = new ReducerRegistry(initialReducers);

		expect(reducerRegistry).to.exist;
		expect(reducerRegistry).to.be.an('object');
		expect(reducerRegistry._reducers).to.deep.equal(initialReducers);
		expect(reducerRegistry._emitChange).to.equal(null);
	});

	it('Should be able to retrieve the current reducers', function() {
		reducerRegistry = new ReducerRegistry(initialReducers);

		const reducers = reducerRegistry.getReducers();
		expect(reducers).to.deep.equal(initialReducers);
	});

	it('Should be able to register a new reducer', function() {
		const newReducers = { reducer3: sinon.spy() };

		reducerRegistry = new ReducerRegistry(initialReducers);
		reducerRegistry.register(newReducers);

		const reducers = reducerRegistry.getReducers();
		expect(reducers).to.be.an('object');
		expect(reducers).not.to.deep.equal(initialReducers);
		expect(reducers).to.have.keys(['reducer1', 'reducer2', 'reducer3']);
		expect(reducers.reducer3).to.equal(newReducers.reducer3);
	});

	it('Should update a reducer if registered again', function() {
		const newReducers = { reducer2: sinon.spy() };

		reducerRegistry = new ReducerRegistry(initialReducers);
		reducerRegistry.register(newReducers);

		const reducers = reducerRegistry.getReducers();
		expect(reducers).to.be.an('object');
		expect(reducers).not.to.deep.equal(initialReducers);
		expect(reducers).to.have.keys(['reducer1', 'reducer2']);
		expect(reducers.reducer2).not.to.equal(initialReducers.reducer2);
		expect(reducers.reducer2).to.equal(newReducers.reducer2);
	});

	it('Should be able to register a group of reducers', function() {
		const newReducers = {
			reducer2: sinon.spy(),
			reducer3: sinon.spy(),
			reducer4: sinon.spy()
		};

		reducerRegistry = new ReducerRegistry(initialReducers);
		reducerRegistry.register(newReducers);

		const reducers = reducerRegistry.getReducers();
		expect(reducers).to.be.an('object');
		expect(reducers).not.to.deep.equal(initialReducers);
		expect(reducers).to.have.keys(['reducer1', 'reducer2', 'reducer3', 'reducer4']);
		expect(reducers.reducer2).not.to.equal(initialReducers.reducer2);
		expect(reducers.reducer2).to.equal(newReducers.reducer2);
		expect(reducers.reducer3).to.equal(newReducers.reducer3);
		expect(reducers.reducer4).to.equal(newReducers.reducer4);
	});

	it('Should be able to set a change listener', function() {
		const listener = sinon.spy();

		reducerRegistry = new ReducerRegistry(initialReducers);
		reducerRegistry.setChangeListener(listener);

		expect(reducerRegistry._emitChange).to.equal(listener);
	});

	it('Should prevent to set a second change listener', function() {
		const listener = sinon.spy();

		reducerRegistry = new ReducerRegistry(initialReducers);
		reducerRegistry.setChangeListener(listener);

		expect(reducerRegistry._emitChange).to.equal(listener);
		expect(reducerRegistry.setChangeListener.bind(reducerRegistry, listener)).to.throw(
			Error, 'Can only set the listener for a ReducerRegistry once.'
		);
	});

	it('Should prevent to set a change listener that is not a function', function() {
		reducerRegistry = new ReducerRegistry(initialReducers);

		expect(reducerRegistry._emitChange).to.equal(null);
		expect(reducerRegistry.setChangeListener.bind(reducerRegistry, {})).to.throw(
			Error, 'The listener must be a valid function.'
		);
	});

	it('Should notify a change in reducers when a new reducer is registered', function() {
		const newReducers = { reducer3: sinon.spy() };
		const listener = sinon.spy();

		reducerRegistry = new ReducerRegistry(initialReducers);

		reducerRegistry.setChangeListener(listener);
		expect(reducerRegistry._emitChange).to.equal(listener);

		reducerRegistry.register(newReducers);

		const reducers = reducerRegistry.getReducers();
		expect(reducers).to.have.keys(['reducer1', 'reducer2', 'reducer3']);
		expect(reducers.reducer3).to.equal(newReducers.reducer3);
		expect(listener.callCount).to.equal(1);
	});
});
