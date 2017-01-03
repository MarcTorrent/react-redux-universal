import { expect } from 'chai';

import faqs from '../../fixtures/faqs.json';
import { types } from '../../../src/FAQ/actions';
import faqReducer from '../../../src/FAQ/reducer';

describe('FAQ reducer', function() {
	let state;

	it('Should handle action with unknown type', function() {
		state = faqReducer(undefined, {});

		expect(state).to.be.an('object');
		expect(state).to.have.keys(['selectedFAQ', 'faqs']);
		expect(state.selectedFAQ).to.equal(null);
		expect(state.faqs).to.be.an('array');
		expect(state.faqs).to.have.lengthOf(0);
	});

	it('Should handle action with FAQ_REQUEST_OK type', function() {
		state = faqReducer(undefined, {
			type: types.FAQ_REQUEST_OK,
			faq: faqs[0]
		});

		expect(state).to.be.an('object');
		expect(state.selectedFAQ).to.deep.equal(faqs[0]);
	});

	it('Should handle action with FAQ_LIST_REQUEST_OK type', function() {
		state = faqReducer(undefined, {
			type: types.FAQ_LIST_REQUEST_OK,
			payload: faqs
		});

		expect(state).to.be.an('object');
		expect(state.faqs).to.deep.equal(faqs);
	});
});
