import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Link, IndexLink } from 'react-router';
import Nav from '../../../../../src/App/components/Nav';

describe('Nav component', function() {
	let wrapper;

	beforeEach(function() {
		wrapper = shallow(<Nav />);
	});

	it('Should exist', function() {
		expect(wrapper).to.exist;
	});

	it('Should have base class', function() {
		expect(wrapper.hasClass('nav')).to.equal(true);
	});

	it('Should have an index link with correct props', function() {
		const indexLink = wrapper.find(IndexLink);

		expect(indexLink).to.have.lengthOf(1);
		expect(indexLink.prop('to')).to.equal('/');
		expect(indexLink.children().text()).to.equal('Home');
	});

	it('Should have a link to the about section', function() {
		const link = wrapper.find(Link).at(0);

		expect(link).to.have.lengthOf(1);
		expect(link.prop('to')).to.equal('/about');
		expect(link.children().text()).to.equal('About');
	});

	it('Should have a link to the faq section', function() {
		const link = wrapper.find(Link).at(1);

		expect(link).to.have.lengthOf(1);
		expect(link.prop('to')).to.equal('/faq');
		expect(link.children().text()).to.equal('FAQ');
	});
});
