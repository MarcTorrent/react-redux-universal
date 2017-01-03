import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import { loadFAQList } from '../../actions';

if (process.env.BROWSER) {
	require('./faq.scss');
}

export const redial = {
	fetch: ({ dispatch }) => dispatch(loadFAQList())
};

function renderFAQS(faqs) {
	return faqs.map(faq => <li key={faq.id}>{faq.description}</li>);
}

export const FAQ = (props) => {
	return (
		<div>
			<Helmet
				title="FAQ Page"
				/>
			<h2>FAQ Page</h2>
			
			<ul>{renderFAQS(props.faqs)}</ul>
		</div>
	);
};

FAQ.propTypes = {
	faqs: PropTypes.array
};

export const mapStateToProps = state => {
	return { faqs: state.faqReducer.faqs };
};

export default provideHooks(redial)(connect(mapStateToProps)(FAQ));
