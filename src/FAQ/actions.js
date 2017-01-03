const BASE_URL = 'http://localhost:5000';

export const types = {
	FAQ_REQUESTED: 'FAQ_REQUESTED',
	FAQ_REQUEST_OK: 'FAQ_REQUEST_OK',
	FAQ_LIST_REQUEST_OK: 'FAQ_LIST_REQUEST_OK'
};

export function loadFAQList() {
	return (dispatch) => {
		return fetch(`${BASE_URL}/api/1/faq`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			dispatch({type: types.FAQ_LIST_REQUEST_OK, payload: data});
		});
	};
}

export function loadFAQ(faqId) {
	return {
		type: types.FAQ_REQUESTED,
		payload: {
			faqId: faqId
		}
	};
}
