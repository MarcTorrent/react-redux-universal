import React from 'react';
import Helmet from 'react-helmet';

if (process.env.BROWSER) {
	require('./about.scss');
}

const About = () => {
	return (
		<div>
			<Helmet
				title="About"
				/>
			<h2>About</h2>
		</div>
	);
};

export default About;
