import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
	class RequireAuthentication extends Component {

		componentWillMount() {
			if (!this.props.authenticated) {
				this.context.router.push('/');
			}
		}

		componentWillUpdate(nextProps) {
			if (!nextProps.authenticated) {
				this.context.router.push('/');
			}
		}

		render() {
			return <ComposedComponent {...this.props} />;
		}
	}

	RequireAuthentication.contextTypes = {
		router: PropTypes.object
	};

	RequireAuthentication.propTypes = {
		authenticated: PropTypes.bool
	};

	function mapStateToProps(state) {
		return { authenticated: state.auth.authenticated };
	}

	return connect(mapStateToProps)(RequireAuthentication);
}
