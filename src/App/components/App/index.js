import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import Nav from '../Nav/';

if (process.env.BROWSER) {
	require('./app.scss');
}

const App = ({ children }) => {
	return (
		<div className='container'>
			<Helmet
				title="React Redux Universal - Base Project"
				titleTemplate="%s - React Redux Universal - Base Project"
				/>
			<h1>React Redux Universal - Use it as your base project for Isomorphic Web Apps</h1>
			<Nav />
			{children}
			<footer className='footer'>
				Copyright © 2016 Marc Torrent Vernetta
			</footer>
		</div>
	);
};

App.propTypes = {
	children: PropTypes.object.isRequired
};

export default App;
