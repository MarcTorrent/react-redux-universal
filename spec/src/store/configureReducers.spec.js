import { expect } from 'chai';
import sinon from 'sinon';

import * as redux from 'redux';
import configureReducers from '../../../src/store/configureReducers';

describe('Configure reducers', function() {
	beforeEach(function() {
		sinon.stub(redux, 'combineReducers');
	});

	afterEach(function() {
		redux.combineReducers.restore();
	});

	it('Should combine reducers with the passed reducers', function() {
		const reducers = { reducer1: sinon.spy(), reducer2: sinon.spy() };
		
		configureReducers(reducers);
		expect(redux.combineReducers.callCount).to.equal(1);
		expect(redux.combineReducers.calledWith(reducers)).to.equal(true);
	});
});
