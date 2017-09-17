const db = require('../db');
const roles = require('../../lib/user-roles');
const validUserName = require('../../lib/valid-user-name');
const pw = require('../../lib/password');

/**
 * Attempts to create a user.
 * @param {string} name - The user name.
 * @param {string} password - The user password.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the user will be returned in the result's `data.user` property.
 */
async function createUser(name, password) {
	const result = {};

	// Fail if invalid name or password.
	if (!validUserName(name) || !pw.valid(password)) {
		result.status = 'fail';
		result.data = {};

		if (!validUserName(name)) {
			result.data.name = 'Invalid name, check requirements.';
		}

		if (!pw.valid(password)) {
			result.data.password = 'Invalid password, check requirements.';
		}

		return result;
	}

	// Get salt for the password hash.
	const salt = pw.getSalt();
	// Define the number of hash iterations to perform.
	const iterations = pw.getIterations();
	// Calculate the password hash.
	const hash = pw.calculateHash(password, salt, iterations);

	const queryStr = 'INSERT INTO users (name, password.hash, password.salt, password.iterations, role) ' +
		'VALUES ($1, $2, $3, $4, $5) RETURNING name, role';
	const values = [name, hash, salt, iterations, roles.USER];

	return db.one(queryStr, values)
		.then((user) => {
			result.status = 'success';
			result.data = { user };

			return result;
		})
		.catch((error) => {
			// Consider the error a fail if name already exists.
			if (Number(error.code) === 23505) {
				// Name already exists. (23505 unique_violation)
				result.status = 'fail';
				result.data = { name: 'Name already exists.' };

				return result;
			}

			result.status = 'error';
			result.message = 'Error creating user.';
			result.data = { error };

			return result;
		});
}

module.exports = createUser;
