const db = require('../db');
const roles = require('../../lib/user-roles');

/**
 * Attempts to get users.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the list of users will be returned in the result's `data.users`
 * property.
 */
async function getUsers(requestingUser) {
	const result = {};

	// Fail if requesting user isn't an admin.
	if (requestingUser.role !== roles.ADMIN) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	return db.any('SELECT name, role FROM users ORDER BY name')
		.then((users) => {
			result.status = 'success';
			result.data = { users };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error retrieving users.';
			result.data = { error };

			return result;
		});
}

module.exports = getUsers;
