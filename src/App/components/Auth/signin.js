import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signin extends Component {
	handleFormSubmit(ev) {
		ev.preventDefault();
		this.props.signinUser({ email: this.email.value, password: this.password.value });
	}

	renderAlert() {
		if (this.props.errorMessage) {
			return (
				<div className="alert alert-danger">
					<strong>Oops!</strong>{this.props.errorMessage}
				</div>
			);
		}
	}

	render() {
		return (
			<form onSubmit={this.handleFormSubmit.bind(this)}>
				<fieldset className="form-group">
					<label>Email:</label>
					<input
						className="form-control"
						ref={node => this.email = node}
					/>
				</fieldset>
				<fieldset className="form-group">
					<label>Password:</label>
					<input
						className="form-control"
						type="password"
						ref={node => this.password = node}
					/>
				</fieldset>
				{this.renderAlert()}
				<button type="submit" className="btn btn-primary">Sign In</button>
			</form>
		);
	}
}

Signin.propTypes = {
	errorMessage: PropTypes.string,
	signinUser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(Signin);
