import { USER_AUTHENTICATED, USER_LOGOUT, USER_AUTHENTICATION_REQUEST, USER_SIGNUP_REQUEST, USER_AUTHENTICATION_ERR } from './types';
import * as resources from '../../plugins/resources';
import { AUTH_COOKIE } from '../../constants';

const EXPIRATION_COOKIE = 3600;

export function signinUser({ email, password }) {
	return {
		type: USER_AUTHENTICATION_REQUEST,
		payload: { email, password }
	};
}

export function signupUser({ email, password }) {
	return {
		type: USER_SIGNUP_REQUEST,
		payload: { email, password }
	};
}

export function userAuthenticated(token) {
	resources.deleteCookie(AUTH_COOKIE);
	resources.setCookie(AUTH_COOKIE, token, EXPIRATION_COOKIE);
	return {
		type: USER_AUTHENTICATED
	};
}

export function authError(error) {
	return {
		type: USER_AUTHENTICATION_ERR,
		payload: error
	};
}

export function signoutUser() {
	resources.deleteCookie(AUTH_COOKIE);
	return { type: USER_LOGOUT };
}
