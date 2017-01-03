import { expect } from 'chai';

import NotFound from '../../../src/NotFound/components/NotFound';
import notFoundRoute from '../../../src/NotFound';

describe('NotFound route', function() {
	it('Should exist', function() {
		expect(notFoundRoute).to.exist;
		expect(notFoundRoute).to.be.an('object');
	});

	it('Should have the correct structure', function() {
		expect(notFoundRoute).to.have.keys(['path', 'component']);

		expect(notFoundRoute.path).to.equal('*');
		expect(notFoundRoute.component).to.equal(NotFound);
	});
});