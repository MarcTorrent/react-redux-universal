import { types } from './actions';

export default function(state = { addresses: [], things: [] }, action) {
	let newAddress,
		addresses;
	let oldIndex = -1;
	switch (action.type) {
	case types.ADDRESS_LIST_REQUEST_OK:
		return {...state, addresses: action.payload};
	case types.ADDRESS_UPDATED:
		newAddress = action.payload;
		addresses = [...state.adresses];
		addresses.forEach((address, index) => {
			if (address.id === newAddress.id) {
				oldIndex = index;
			}
		});
		if (oldIndex > -1) {
			addresses.splice(oldIndex, 1);
		}

		return {...state, addresses: [...addresses, newAddress]};
	case types.THING_LIST_REQUEST_OK:
		return {...state, things: action.payload};
	}
	return state;
}
