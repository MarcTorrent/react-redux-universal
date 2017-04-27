import User from '../../models/user';
import jwt from 'jwt-simple';

import { SECRET } from '../../services/passport';

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, SECRET);
}

export function signupController(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		res.status(422).send({error: 'You must provide an email and a password'});
	}

	// See if a user with the given email exists
	User.findOne({ email }, function(err, existingUser) {
		if (err) {
			return next(err);
		}

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({error: 'Email is in use'});
		}
		// If a user with email does NOT exist, create and save user record
		const user = new User({
			email,
			password
		});

		user.save(function(err) {
			if (err) {
				return next(err);
			}

			// Respond to request indicating the user was created
			res.statusCode = 201;
			res.json({ token: tokenForUser(user)});
		});
	});
}

export function signinController(req, res) {
	res.json({ token: tokenForUser(req.user) });
}

export function signoutController(req, res) {
	// TODO: invalidate current token
	res.json({});
}
