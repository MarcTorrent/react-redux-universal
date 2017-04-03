import { put, call } from 'redux-saga/effects';
import { takeEvery, delay } from 'redux-saga';
import * as actions from '../actions/types';

export function* authenticate() {

	yield call(delay, 200);
	yield put({type: actions.USER_AUTHENTICATED});
}

export default function* authSaga() {
	yield takeEvery(actions.REQUEST_USER_AUTHENTICATION, authenticate);
}
