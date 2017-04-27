import passport from 'passport';
import User from '../models/user';
import { JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

export const SECRET = 'lshbgwhbgjlwebrgk1236876484jwbkhbwerkjhvkjwhebknw874592jhgwjehrjhersvgjk7254hwvejkrhfvjkwh';


// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this email and password, call done with the user
	// if it is the correct email and password
	// otherwise, call done with false
	User.findOne({email: email}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false);
		}

		// compare passwords - is 'password' equal to user.password ?
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}
			if (!isMatch) {
				return done(null, false);
			}
			return done(null, user);
		});
	});
});

// TODO: The JwtStrategy is not currently used in the application.
// It should be use to grant access to parts of the application or requests to the API that need the user to be signed in

// Setup options for JWT Strategy
// const jwtOptions = {
// 	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
// 	secretOrKey: SECRET
// };

// Create JWT strategy
// const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
// 	// See if the user ID in the payload exists in our database
// 	// If it does, call 'done' with that user
// 	// otherwise, call done without a user object
// 	User.findById(payload.sub, function(err, user) {
// 		if (err) {
// 			return done(err, false);
// 		}
// 		if (user) {
// 			done(null, user);
// 		} else {
// 			done(null, false);
// 		}
// 	});
// });

// Tell passport to use this strategy
// passport.use(jwtLogin);
passport.use(localLogin);

export const requireSignin = passport.authenticate('local', { session: false });
