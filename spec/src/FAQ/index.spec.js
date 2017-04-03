import { expect } from 'chai';
import sinon from 'sinon';

import FAQ from '../../../src/FAQ/components/FAQ';
import faqReducer from '../../../src/FAQ/reducer';
import faqRoute from '../../../src/FAQ';

describe('FAQ route', function() {
	it('Should exist', function() {
		expect(faqRoute).to.exist;
		expect(faqRoute).to.be.a('function');
	});

	it('Should have the correct structure', function() {
		const route = faqRoute();

		expect(route).to.be.an('object');
		expect(route).to.have.keys(['path', 'getComponents']);
		expect(route.path).to.equal('faq');
		expect(route.getComponents).to.be.a('function');
	});

	it('Should get components when the route is loaded', function() {
		const reducerRegistry = { register: sinon.spy() };
		const sagaRegistry = { register: sinon.spy() };
		const callback = sinon.spy();
		const route = faqRoute(reducerRegistry, sagaRegistry);

		route.getComponents(null, callback);
		expect(reducerRegistry.register.callCount).to.equal(1);
		expect(reducerRegistry.register.calledWith({ faqReducer })).to.equal(true);

		expect(callback.callCount).to.equal(1);
		expect(callback.calledWith(null, FAQ)).to.equal(true);
	});
});
