import { expect } from 'chai';
import sinon from 'sinon';

import faqs from '../../fixtures/faqs.json';
import * as faqActions from '../../../src/FAQ/actions';

describe('FAQ actions', function() {

	describe('Load FAQ list', function() {
		let response;
		let dispatch;

		beforeEach(function() {
			dispatch = sinon.spy();

			// Fetch is stubbed since sinon fakeServer is not ready to work in Node.
			response = Promise.resolve({ json: () => faqs });
			sinon.stub(global, 'fetch', () => response);
		});

		afterEach(function() {
			global.fetch.restore();
		});

		it('Should dispatch FAQ_LIST_REQUEST_OK action if loading is successful', function() {
			return faqActions.loadFAQList()(dispatch).then(() => {
				expect(dispatch.callCount).to.equal(1);
				expect(dispatch.calledWith({
					type: faqActions.types.FAQ_LIST_REQUEST_OK,
					payload: faqs
				})).to.equal(true);
			});
		});

		it('Should not dispatch if there is an error fetching data', function() {
			response = Promise.reject();

			return faqActions.loadFAQList()(dispatch).catch(() => {
				expect(dispatch.callCount).to.equal(0);
			});
		});
	});

	describe('Load FAQ', function() {
		let action;

		it('Should generate an action with correct type', function() {
			action = faqActions.loadFAQ();

			expect(action.type).to.equal(faqActions.types.FAQ_REQUESTED);
		});

		it('Should generate an action with empty payload', function() {
			action = faqActions.loadFAQ();

			expect(action.payload).to.be.an('object');
			expect(action.payload).to.have.keys(['faqId']);
			expect(action.payload.faqId).to.equal(undefined);
		});

		it('Should generate an action with correct payload', function() {
			action = faqActions.loadFAQ(1);

			expect(action.payload).to.be.an('object');
			expect(action.payload).to.have.keys(['faqId']);
			expect(action.payload.faqId).to.equal(1);
		});
	});

});