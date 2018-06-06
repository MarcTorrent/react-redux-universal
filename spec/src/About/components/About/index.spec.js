import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Helmet from 'react-helmet';
import About from '../../../../../src/About/components/About';

describe('About component', function() {
	let wrapper;

	beforeEach(function() {
		wrapper = shallow(<About />);
	});

	it('Should exist', function() {
		expect(wrapper).to.exist;
	});

	it('Should have a helmet element with correct props', function() {
		const helmet = wrapper.find(Helmet);

		expect(helmet).to.have.lengthOf(1);
		expect(helmet.prop('title')).to.equal('About');
	});

	it('Should have a header tag with the title', function() {
		const header = wrapper.find('h2');

		expect(header).to.have.lengthOf(1);
		expect(header.text()).to.equal('About');
	});
});
