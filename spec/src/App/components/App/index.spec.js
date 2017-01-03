import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Helmet from 'react-helmet';
import Nav from '../../../../../src/App/components/Nav';
import App from '../../../../../src/App/components/App';

describe('App component', function() {
	let wrapper;

	beforeEach(function() {
		wrapper = shallow(<App children={<div id="children">Children</div>} />);
	});

	it('Should exist', function() {
		expect(wrapper).to.exist;
	});

	it('Should have base class', function() {
		expect(wrapper.hasClass('container')).to.equal(true);
	});

	it('Should have a helmet element with correct props', function() {
		const helmet = wrapper.find(Helmet);

		expect(helmet).to.have.lengthOf(1);
		expect(helmet.prop('title')).to.equal('React Redux Universal - Base Project');
		expect(helmet.prop('titleTemplate')).to.equal('%s - React Redux Universal - Base Project');
	});

	it('Should have a header tag with the section title', function() {
		const header = wrapper.find('h1');

		expect(header).to.have.lengthOf(1);
		expect(header.text()).to.equal('React Redux Universal - Use it as your base project for Isomorphic Web Apps');
	});

	it('Should have a navigation component', function() {
		expect(wrapper.find(Nav)).to.have.lengthOf(1);
	});

	it('Should render its children', function() {
		const children = wrapper.find('#children');

		expect(children).to.have.lengthOf(1);
		expect(children.text()).to.equal('Children');
	});

	it('Should render a footer', function() {
		const footer = wrapper.find('footer');

		expect(footer).to.have.lengthOf(1);
		expect(footer.hasClass('footer')).to.equal(true);
		expect(footer.text()).to.equal('Copyright © 2016 Marc Torrent Vernetta');
	});
});
