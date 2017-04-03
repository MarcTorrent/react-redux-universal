import { takeEvery, put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { types } from './actions';

function* faqRequest(faqId) {
	console.log('FAQ request received with Id ' + faqId);
	let faq = {id: 12345, title: 'First FAQ', description: 'Once upon a time...'};
	/*
	faq = yield call(Api.getFaq, faqId);
	*/
	yield call(delay, 200);
	put(types.FAQ_REQUEST_OK, faq);
	// TODO: Handle cancelled task
}

export default function* faqSaga() {
	yield takeEvery(types.FAQ_REQUESTED, faqRequest);
}
