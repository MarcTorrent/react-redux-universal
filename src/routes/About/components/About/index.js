import React from 'react';

if (process.env.BROWSER) {
	require('./about.scss');
}

const About = () => {
	return (
		<div>
			<h2>About</h2>
		</div>
	);
};

export default About;
