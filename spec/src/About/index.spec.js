import { expect } from 'chai';

import About from '../../../src/About/components/About';
import route from '../../../src/About';

describe('About route', function() {
	it('Should exist', function() {
		expect(route).to.exist;
		expect(route).to.be.an('object');
	});

	it('Should have the correct structure', function() {
		expect(route).to.have.keys(['path', 'component']);

		expect(route.path).to.equal('about');
		expect(route.component).to.equal(About);
	});
});