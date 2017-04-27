import { put, call, take, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { browserHistory } from 'react-router';
import { USER_LOGOUT, USER_AUTHENTICATION_REQUEST, USER_SIGNUP_REQUEST, USER_AUTHENTICATION_ERR } from '../actions/types';
import * as actions from '../actions';
import * as api from '../../plugins/api';

export function* authenticate({ email, password }) {

	const { data } = yield race({
		data: call(api.signin, { email, password }),
		timeout: call(delay, 5000)
	});

	console.log(data);

	if (data && data.token) {
		yield put(actions.userAuthenticated(data.token));
		yield call(browserHistory.push, '/user');
	} else if (data && data.error) {
		yield put(actions.authError(data.error));
	} else {
		yield put(actions.authError('It took too much to authenticate. Please try later.'));
	}
}

export function* signup({ email, password }) {
	// const result = yield race({
	// 	data: call(api.signup, { email, password }),
	// 	timeout: call(delay, 5000)
	// });
	// const data = result.data;
	// const timeout = result.timeout;
	const data = yield call(api.signup, { email, password });

	if (data && data.token) {
		yield put(actions.userAuthenticated(data.token));
		yield call(browserHistory.push, '/user');
	} else if (data && data.error) {
		yield put(actions.authError(data.error));
	} else {
		yield put(actions.authError('It took too much to authenticate. Please try later.'));
	}
}

export function* signout() {
	yield call(api.signout);
}

export default function* authSaga() {
	let task;
	while (true) {
		// wait until USER_AUTHENTICATION_REQUEST or USER_SIGNUP_REQUEST action
		const authAction = yield take([USER_AUTHENTICATION_REQUEST, USER_SIGNUP_REQUEST]);
		if (authAction.type === USER_AUTHENTICATION_REQUEST) {
			console.log('login');
			task = yield fork(authenticate, authAction.payload);
		} else {
			console.log('register');
			task = yield fork(signup, authAction.payload);
		}
		// wait until USER_AUTHENTICATION_ERR or USER_LOGOUT action
		const logoutAction = yield take([USER_LOGOUT, USER_AUTHENTICATION_ERR]);
		if (logoutAction.type === USER_LOGOUT) {
			yield cancel(task);
			yield fork(signout, logoutAction.payload);
		}
	}
}
