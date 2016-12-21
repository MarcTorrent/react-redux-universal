import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import { loadFAQList } from '../../actions';

if (process.env.BROWSER) {
	require('./faq.scss');
}

const redial = {
	fetch: ({ dispatch }) => dispatch(loadFAQList())
};

function renderFAQS(faqs) {
	return faqs.map( faq => <li key={faq.id}>{faq.description}</li>);
}

const FAQ = (props) => {
	return (
		<div>
			<Helmet
				title="FAQ Page"
				/>
			<h2>FAQ Page</h2>
            <ul>
            {renderFAQS(props.faqs)}
            </ul>
		</div>
	);
};

FAQ.propTypes = {
	faqs: PropTypes.array
};

const mapSateToProps = state => {
	return {faqs: state.faqReducer.faqs || []};
};

export default provideHooks(redial)(connect(mapSateToProps)(FAQ));
