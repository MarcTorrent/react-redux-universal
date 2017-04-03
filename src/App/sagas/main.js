import { take, cancel, fork, call } from 'redux-saga/effects';
import { REGISTER_NEW_SAGAS } from '../actions/types';

// a registry of running sagas
let tasks = {};

function* registerSagas(newSagas) {
	// The payload should be in the form of {nameOfTheSaga: sagaGeneratorFunction}
	// Cancel running tasks from the same saga
	const keys = Object.keys(newSagas);
	for (let i=0; i<keys.length; i++) {
		const key = keys[i];
		if (tasks[key]) {
			yield cancel(tasks[key]);
		}
		// Run the saga and keep a reference to the task
		tasks[key] = yield fork(newSagas[key]);
	}
}

export default function* mainSaga() {
	const loop = true;
	// start receiving actions
	while (loop) {
		const { payload} = yield take(REGISTER_NEW_SAGAS);
		yield call(registerSagas, payload);
	}

}
