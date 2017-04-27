import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import * as actions from '../../actions';

if (process.env.BROWSER) {
	require('./nav.scss');
}

class Nav extends Component {

	renderLinks() {
		if (this.props.authenticated) {
			return [
				<Link key="3" to="/user">My Account</Link>,
				<a key="4" onClick={() => {this.props.signoutUser();}}>Sign Out</a>
			];
		} else {
			return [
				<Link key="1" to="/signin">Sign In</Link>,
				<Link key="2" to="/signup">Sign Up</Link>
			];
		}
	}

	render() {
		return (
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
				{this.renderLinks()}
			</div>
		);
	}
}

Nav.propTypes = {
	authenticated: PropTypes.bool,
	signoutUser: PropTypes.func
};

function mapStateToProps(state) {
	return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(Nav);
