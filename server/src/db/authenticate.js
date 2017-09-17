const jwt = require('jsonwebtoken');
const db = require('./db');
const pw = require('../lib/password');
const secret = require('../config').secret;

/**
 * Attempts to authenticate a user.
 * @param {string} name - The user to authenticate.
 * @param {string} password - The user's password.
 * @return {object} The result of the authentication attempt as a
 * JSend-format object. If successful, a JSON Web Token with the user's data
 * as the payload will be included in the result's `data.token` property.
 */
async function authenticate(name, password) {
	const result = {};

	return db.oneOrNone('SELECT name, password, role FROM users WHERE name=$1', [name])
		.then((user) => {
			// Fail if no user found.
			if (!user) {
				result.status = 'fail';
				result.data = { name: 'No user with that name exists.' };

				return result;
			}

			// Parsed password object.
			const parsedPassword = pw.parseFromDB(user.password);

			// Calculate password hash.
			const hash = pw.calculateHash(password, parsedPassword.salt, parsedPassword.iterations);

			// Fail if password hashes don't match.
			if (hash !== parsedPassword.hash) {
				result.status = 'fail';
				result.data = { password: 'Wrong password.' };

				return result;
			}

			// Create a token with the authenticated user's data as the payload.
			const token = jwt.sign(user, secret, { expiresIn: '10m' });

			result.status = 'success';
			result.data = { token };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error authenticating.';

			console.log('Authentication error:');
			console.log(error);

			return result;
		});
}

module.exports = authenticate;
