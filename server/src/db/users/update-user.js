const db = require('../db');
const roles = require('../../lib/user-roles');
const pw = require('../../lib/password');

/**
 * Attempts to update a specific user.
 * @param {string} name - The name of the target user.
 * @param {object} updates - The updates for the target user.
 * @param {string} [updates.name] - The new name.
 * @param {string} [updates.password] - The new password.
 * @param {string} [updates.role] - The new role.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the user will be returned in the result's `data.user` property.
 */
async function updateUser(name, updates, requestingUser) {
	const result = {};

	// Fail if requesting user isn't admin or the target user.
	if (requestingUser.role !== roles.ADMIN && requestingUser.name !== name) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	// Fail if requesting user isn't admin and is attempting to set the target user's role.
	if (requestingUser.role !== roles.ADMIN && updates.role) {
		result.status = 'fail';
		result.data = { role: 'You may not update role.' };

		return result;
	}

	// Build query string and values.
	let queryStr = 'UPDATE users SET name = $2';
	const values = [name, updates.name || name];

	if (updates.password) {
		const salt = pw.getSalt();
		const iterations = pw.getIterations();
		const hash = pw.calculateHash(updates.password, salt, iterations);

		queryStr += ', password.hash = $3, password.salt = $4, password.iterations = $5';
		values.push(hash, salt, iterations);
	}

	if (updates.role) {
		if (updates.password) {
			queryStr += ', role = $6';
		} else {
			queryStr += ', role = $3';
		}

		values.push(updates.role);
	}

	queryStr += ' WHERE name = $1 RETURNING name, role';

	return db.oneOrNone(queryStr, values)
		.then((user) => {
			// Fail if no user found.
			if (!user) {
				result.status = 'fail';
				result.data = { name: 'No user with that name exists.' };

				return result;
			}

			result.status = 'success';
			result.data = { user };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error updating user.';
			result.data = { error };

			return result;
		});
}

module.exports = updateUser;
