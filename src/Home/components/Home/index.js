import React from 'react';

if (process.env.BROWSER) {
	require('./home.scss');
}

const Home = () => {
	return (
		<div>
			<h2>Home</h2>
		</div>
	);
};

export default Home;
