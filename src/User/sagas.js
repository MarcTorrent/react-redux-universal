import { put, call, take, fork, cancel, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { types } from './actions';
import * as actions from './actions';
import * as api from '../plugins/api';

export function* thingsSaga() {
	// while(true) {
	// 	yield take()
	// 	yield fork()
	// }
	//
	// const { data } = yield race({
	// 	data: call(api.signin, { user, password }),
	// 	timeout: call(delay, 5000)
	// });
	//
	// if (data && data.token) {
	// 	yield put(actions.userAuthenticated(data.token));
	// 	yield call(browserHistory.push, '/user');
	// } else {
	// 	yield put(actions.authError('It took too much to authenticate. Please try later.'));
	// }
}

export function* addressesSaga() {
	// const { data } = yield race({
	// 	data: call(api.signup, { user, password }),
	// 	timeout: call(delay, 5000)
	// });
	//
	// if (data && data.token) {
	// 	yield put(actions.userAuthenticated(data.token));
	// 	yield call(browserHistory.push, '/user');
	// } else {
	// 	yield put(actions.authError('It took too much to authenticate. Please try later.'));
	// }
}


export default function* userSaga() {
	yield call([thingsSaga, addressesSaga]);
}
