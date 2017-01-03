import { types } from './actions';

export default function(state = { selectedFAQ: null, faqs: [] }, action) {
	switch (action.type) {
	case types.FAQ_REQUEST_OK:
		return {...state, selectedFAQ: action.faq};
	case types.FAQ_LIST_REQUEST_OK:
		return {...state, faqs: action.payload};
	}
	return state;
}
