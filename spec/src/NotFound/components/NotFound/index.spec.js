import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Helmet from 'react-helmet';
import NotFound from '../../../../../src/NotFound/components/NotFound';

describe('NotFound component', function() {
	let wrapper;

	beforeEach(function() {
		wrapper = shallow(<NotFound />);
	});

	it('Should exist', function() {
		expect(wrapper).to.exist;
	});

	it('Should have a helmet element with correct props', function() {
		const helmet = wrapper.find(Helmet);

		expect(helmet).to.have.lengthOf(1);
		expect(helmet.prop('title')).to.equal('Not Found');
	});

	it('Should have a header tag with the section title', function() {
		const header = wrapper.find('h2');

		expect(header).to.have.lengthOf(1);
		expect(header.text()).to.equal('Page Not Found!');
	});
});