import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { expect } from 'chai';

import { authenticate } from '../../../../src/App/sagas/auth';
import * as actions from '../../../../src/App/actions/types';

describe('Auth saga', function() {

	it('Should authenticate any user after 200ms', function() {
		const gen = authenticate();
		let { value, done } = gen.next();

		expect(value).to.deep.equal(call(delay, 200));
		expect(done).to.equal(false);

		({ value, done } = gen.next());
		expect(value).to.deep.equal(put({ type: actions.USER_AUTHENTICATED }));
		expect(done).to.equal(false);

		({ value, done } = gen.next());
		expect(value).to.equal(undefined);
		expect(done).to.equal(true);

	});
});
