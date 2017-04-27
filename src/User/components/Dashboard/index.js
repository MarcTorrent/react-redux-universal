import React from 'react';

if (process.env.BROWSER) {
	require('./dashboard.scss');
}

const Dashboard = () => {
	return (
		<div>
			<h2>Welcome to your private account</h2>
		</div>
	);
};

export default Dashboard;
