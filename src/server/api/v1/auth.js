import { Router } from 'express';
import User from '../../models/user';

const router = new Router();


router.post('/', (req, res, next) => {
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;

	// See if a user with the given email exists
	User.findOne({email: email}, function(err, existingUser) {
		if (err) {
			return next(err);
		}

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({error: 'Email is in use'});
		}
		// If a user with email does NOT exist, create and save user record
		const user = new User({
			firstName: firstName,
			lastName: lastName,
			email: email
		});

		user.save(function(err) {
			if (err) {
				return next(err);
			}

			// Respond to request indicating the user was created
			res.statusCode = 201;
			res.json({});
		});
	});
});

module.exports = router;
