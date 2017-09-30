const db = require('../db');
const roles = require('../../lib/user-roles');

/**
 * Attempts to delete a specific user.
 * @param {string} name - The name of the target user.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the user will be returned in the result's `data.user` property.
 */
async function deleteUser(name, requestingUser) {
	const result = {};

	// Fail if requesting user isn't admin or the target user.
	if (requestingUser.role !== roles.ADMIN && requestingUser.name !== name) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	return db.oneOrNone('DELETE FROM users WHERE name = $1 RETURNING name, role', [name])
		.then((user) => {
			// Fail if user wasn't found.
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
			result.message = 'Error deleting user.';
			result.data = { error };

			return result;
		});
}

module.exports = deleteUser;
