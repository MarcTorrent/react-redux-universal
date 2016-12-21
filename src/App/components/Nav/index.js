import React from 'react';
import { Link, IndexLink } from 'react-router';

if (process.env.BROWSER) {
	require('./nav.scss');
}

const Nav = () =>
	<div className="nav">
		<IndexLink to="/">
			Home
		</IndexLink>
		<Link to="/about">
			About
		</Link>
		<Link to="/faq">
			FAQ
		</Link>
	</div>;


export default Nav;
