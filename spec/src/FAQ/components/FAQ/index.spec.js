import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import faqs from '../../../../fixtures/faqs.json';
import Helmet from 'react-helmet';
import { FAQ, mapStateToProps, redial } from '../../../../../src/FAQ/components/FAQ';

describe('FAQ component', function() {

	describe('Component', function() {
		let wrapper;

		beforeEach(function() {
			wrapper = shallow(<FAQ faqs={faqs} />);
		});

		it('Should exist', function() {
			expect(wrapper).to.exist;
		});

		it('Should have a helmet element with correct props', function() {
			const helmet = wrapper.find(Helmet);

			expect(helmet).to.have.lengthOf(1);
			expect(helmet.prop('title')).to.equal('FAQ Page');
		});

		it('Should render a list of faqs', function() {
			const list = wrapper.find('ul');
			expect(list).to.have.lengthOf(1);

			const items = list.find('li');
			expect(items).to.have.lengthOf(3);
			expect(items.at(0).key()).to.equal('1');
			expect(items.at(0).text()).to.equal('This is the description of the FAQ #1');

			expect(items.at(1).key()).to.equal('2');
			expect(items.at(1).text()).to.equal('This is the description of the FAQ #2');

			expect(items.at(2).key()).to.equal('3');
			expect(items.at(2).text()).to.equal('This is the description of the FAQ #3');
		});
	});

	describe('Map state to props', function() {
		it('Should exist', function() {
			expect(mapStateToProps).to.exist;
			expect(mapStateToProps).to.be.a('function');
		});

		it('Should return an empty faqs array', function() {
			const props = mapStateToProps({ faqReducer: { faqs: [] } });

			expect(props).to.have.keys(['faqs']);
			expect(props.faqs).to.be.an('array');
			expect(props.faqs).to.have.lengthOf(0);
		});

		it('Should return a populated faqs array', function() {
			const props = mapStateToProps({ faqReducer: { faqs: faqs } });

			expect(props).to.have.keys(['faqs']);
			expect(props.faqs).to.be.an('array');
			expect(props.faqs).to.have.lengthOf(3);
			expect(props.faqs).to.deep.equal(faqs);
		});
	});

	describe('Redial', function() {
		it('Should exist', function() {
			expect(redial).to.exist;
		});

		it('Should have correct structure', function() {
			expect(redial).to.be.an('object');
			expect(redial).to.have.keys(['fetch']);
			expect(redial.fetch).to.be.a('function');
		});

		it('Should dispatch an action when fetch configuration is called', function() {
			const dispatch = sinon.stub();

			redial.fetch({ dispatch });
			expect(dispatch.calledOnce).to.equals(true);
			expect(dispatch.lastCall.args[0]).to.be.a('function');
		});
	});
});