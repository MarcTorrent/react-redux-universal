import { USER_AUTHENTICATED, USER_LOGOUT, USER_AUTHENTICATION_ERR } from '../actions/types';

export default function(state = {}, action) {
	switch(action.type) {
	case USER_AUTHENTICATED:
		return {...state, error: '', authenticated: true};
	case USER_LOGOUT:
		return {...state, authenticated: false};
	case USER_AUTHENTICATION_ERR:
		return {...state, error: action.payload};
	}

	return state;
}
