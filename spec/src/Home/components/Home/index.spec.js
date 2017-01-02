import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Home from '../../../../../src/Home/components/Home';

describe('Home component', function() {
	let wrapper;

	beforeEach(function() {
		wrapper = shallow(<Home />);
	});

	it('Should exist', function() {
		expect(wrapper).to.exist;
	});

	it('Should have a header tag with the section title', function() {
		const header = wrapper.find('h2');

		expect(header).to.have.lengthOf(1);
		expect(header.text()).to.equal('Home');
	});
});