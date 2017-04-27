import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signup extends Component {
	handleFormSubmit(ev) {
		ev.preventDefault();
		// Call action creator to sign up the user!
		this.props.signupUser({
			email: this.email.value,
			password: this.password.value
		});
	}

	renderAlert() {
		if (this.props.errorMessage) {
			return (
				<div className="alert alert-danger">
					<p><strong>Oops!</strong> {this.props.errorMessage}</p>
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
				<fieldset className="form-group">
					<label>Confirm Password:</label>
					<input
						className="form-control"
						type="password"
						ref={node => this.password = node}
					/>
				</fieldset>
				{this.renderAlert()}
				<button action="submit" className="btn btn-primary">Sign Up!</button>
			</form>
		);
	}
}

Signup.propTypes = {
	errorMessage: PropTypes.string,
	signupUser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(Signup);
