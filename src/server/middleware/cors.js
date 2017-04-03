'use strict';
/*
	This middleware manages CORS Ajax requests.
	We only allow the ones coming from one of our own domains.
*/

// We expect to receive application dynamic domains
module.exports.configure = function _configure() {
	return function (req, res, next) {
		var origin = req.get('Origin'),
			allowedHost,
			allowedOrigin;

		if (origin) { // https://tools.ietf.org/id/draft-abarth-origin-03.html
			allowedHost = 'localhost|0.0.0.0';

			// CORS specification requires Access-Control-Allow-Origin header value to be
			// the same received in the Origin header if it is allowed
			allowedOrigin = origin.match(allowedHost) ? origin : '';

			res.set('Access-Control-Allow-Origin', allowedOrigin);
			res.set('Access-Control-Allow-Methods', 'GET, POST');
			res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Request');
			res.set('Access-Control-Allow-Credentials', 'true');
			res.set('Access-Control-Max-Age', '600');

			if ('OPTIONS' == req.method) {
				return res.sendStatus(200);
			} else {
				next();
			}

		} else {
			next();
		}

	};
};
