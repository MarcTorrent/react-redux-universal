import React from 'react';
import Helmet from 'react-helmet';

if (process.env.BROWSER) {
	require('./not-found.scss');
}

const NotFound = () =>
	<div>
		<Helmet
			title="Not Found"
			/>
		<h2>Page Not Found!</h2>
	</div>;

export default NotFound;
