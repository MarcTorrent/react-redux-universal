import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./faq.scss');
}

function renderFAQS(faqs) {
	return faqs.map( faq => <li key={faq.id}>{faq.description}</li>);
}

const FAQ = (props) => {
	return (
		<div>
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

export default connect(mapSateToProps)(FAQ);
