import { BASE_URL } from '../constants';

export const types = {
	ADDRESS_LIST: 'ADDRESS_LIST',
	ADDRESS_LIST_REQUEST_OK: 'ADDRESS_LIST_REQUEST_OK',
	ADDRESS_DETAIL: 'ADDRESS_DETAIL',
	ADDRESS_UPDATED: 'ADDRESS_UPDATED',
	THING_LIST: 'THING_LIST',
	THING_LIST_REQUEST_OK: 'THING_LIST_REQUEST_OK'
};

export function loadAddressList() {
	return (dispatch) => {
		return fetch(`${BASE_URL}/api/1/address`)
		.then(response => {
			return response.json();
		})
		.then(data => {
			dispatch({type: types.ADDRESS_LIST_REQUEST_OK, payload: data});
		});
	};
}

export function loadAddress(addressId) {
	return {
		type: types.ADDRESS_DETAIL,
		payload: {
			faqId: addressId
		}
	};
}

export function loadThings() {
	return {
		type: types.THING_LIST
	};
}
