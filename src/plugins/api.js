import { BASE_URL } from '../constants';

export function signin(signinData) {
	return fetch(`${BASE_URL}/api/1/signin`, { method: 'POST', body: JSON.stringify(signinData) })
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch((error) => {
			console.log(error);
			const customErr = 'Something went wrong while signin';
			return { error: customErr };
		});
}

export function signup(signupData) {
	return fetch(`${BASE_URL}/api/1/signup`, { method: 'POST', body: JSON.stringify(signupData) })
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
		.catch((error) => {
			return({ error });
		});
}

export function signout() {
	return fetch(`${BASE_URL}/api/1/signout`, { method: 'POST' })
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		});
}
