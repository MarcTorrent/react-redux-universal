import { expect } from 'chai';

import NotFound from '../../../src/NotFound/components/NotFound';
import route from '../../../src/NotFound';

describe('NotFound route', function() {
	it('Should exist', function() {
		expect(route).to.exist;
		expect(route).to.be.an('object');
	});

	it('Should have the correct structure', function() {
		expect(route).to.have.keys(['path', 'component']);

		expect(route.path).to.equal('*');
		expect(route.component).to.equal(NotFound);
	});
});