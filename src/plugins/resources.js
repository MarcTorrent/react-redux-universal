if (typeof(window) !== 'undefined') {
	window.Storage.prototype.setObject = function(key, value) {
		this.setItem(key, JSON.stringify(value));
	};

	window.Storage.prototype.getObject = function(key) {
		const value = this.getItem(key);
		return value && JSON.parse(value);
	};
}



/**
 * Get an object from local storage.
 * @param String Name of the object that must be returned.
 * @returns Object returned from local storage.
 */
export function getStorage(name) {
	try {
		return localStorage.getObject(name);
	} catch(err) {
		return null;
	}
}

/**
 * Set an object to local storage.
 * @param String Name of the object.
 * @param json Object to be stored
 */
export function setStorage(name, json) {
	try {
		localStorage.setObject(name, json);
	} catch(err) {
		console.log(`Unable to set ${name} to localStorage`);
	}
}

export function deleteStorage(name) {
	try {
		if (localStorage[name]) {
			localStorage.removeItem(name);
		}
	} catch(err) {
		console.log(`Unable to delete ${name} from localStorage`);
	}
}

/**
 * Get an object from session storage.
 * @param String Name of the object that must be returned.
 * @returns Object returned from session storage.
 */
export function getSessionStorage(name) {
	try {
		return sessionStorage.getObject(name);
	} catch(err) {
		return null;
	}
}

/**
 * Set an object to session storage.
 * @param String Name of the object.
 * @param json Object to be stored
 */
export function setSessionStorage(name, json) {
	try {
		sessionStorage.setObject(name, json);
	} catch(err) {
		console.log(`Unable to set ${name} to sessionStorage`);
	}
}

export function deleteSessionStorage(name) {
	try {
		if (sessionStorage[name]) {
			sessionStorage.removeItem(name);
		}
	} catch(err) {
		console.log(`Unable to delete ${name} from sessionStorage`);
	}
}

export function setCookie(c_name, value, seconds, domain) {
	let cookie = `${c_name}=${encodeURIComponent(value)}`;
	let date = new Date();

	if (seconds) {
		date.setTime(date.getTime() + seconds * 1000);
		cookie += `; expires=${date.toUTCString()}`;
	}

	if (domain) {
		cookie += `; domain=${domain}`;
	}

	document.cookie = `${cookie}; path=/`;
}


export function deleteCookie(c_name) {
	setCookie(c_name, '', -1);
}

export function getCookie(c_name) {
	const value = document.cookie.match('(?:^|;)\\s*' + c_name + '=([^;]*)');
	return (value) ? decodeURIComponent(value[1]) : null;
}
