import { expect } from 'chai';
import sinon from 'sinon';

import App from '../../src/App/components/App/';
import Home from '../../src/Home/components/Home/';
import aboutRoutes from '../../src/About/';
import * as faqRoutes from '../../src/FAQ/';
import notFoundRoutes from '../../src/NotFound/';
import rootRoutes from '../../src/routes';

describe('Routes', function() {
	it('Should exist', function() {
		expect(rootRoutes).to.exist;
		expect(rootRoutes).to.be.a('function');
	});

	it('Should have the correct structure', function() {
		const routes = rootRoutes();

		expect(routes).to.be.an('object');
		expect(routes).to.have.keys(['path', 'component', 'getChildRoutes', 'indexRoute']);
		expect(routes.path).to.equal('/');
		expect(routes.component).to.equal(App);
		expect(routes.getChildRoutes).to.be.a('function');
		expect(routes.indexRoute).to.be.an('object');
		expect(routes.indexRoute).to.have.keys(['component']);
		expect(routes.indexRoute.component).to.equal(Home);
	});

	it('Should get child routes when the route is loaded', function() {
		const reducerRegistry = { register: sinon.spy() };
		const callback = sinon.spy();
		const routes = rootRoutes(reducerRegistry);

		sinon.spy(faqRoutes, 'default');

		routes.getChildRoutes(null, callback);
		expect(callback.callCount).to.equal(1);

		const args = callback.lastCall.args;
		expect(args[0]).to.equal(null);
		expect(args[1]).to.be.an('array');
		expect(args[1]).to.have.lengthOf(3);
		expect(args[1][0]).to.deep.equal(aboutRoutes);
		expect(args[1][2]).to.deep.equal(notFoundRoutes);

		// faqRoutes returns an object with 'getComponents' function. Due to this, equality
		// can not be checked as it does not work correctly when functions are involved.
		expect(args[1][1]).to.have.keys(['path', 'getComponents']);
		expect(args[1][1].path).to.equal('faq');
		expect(faqRoutes.default.callCount).to.equal(1);
		expect(faqRoutes.default.calledWith(reducerRegistry)).to.equal(true);

		faqRoutes.default.restore();
	});
});
