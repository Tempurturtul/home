const db = require('../db');
const roles = require('../../lib/user-roles');

/**
 * Attempts to delete a specific blog post.
 * @param {number} id - The ID of the target blog post.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the blog post will be returned in the result's `data.blogPost`
 * property.
 */
async function deleteBlogPost(id, requestingUser) {
	const result = {};

	// Fail if requesting user isn't an admin.
	if (requestingUser.role !== roles.ADMIN) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	// Fail if ID isn't an integer.
	if (!Number.isSafeInteger(id)) {
		result.status = 'fail';
		result.data = { id: 'ID must be an integer.' };

		return result;
	}

	return db.oneOrNone('DELETE FROM blogPosts WHERE id = $1 RETURNING *', [id])
		.then((blogPost) => {
			// Fail if blog post wasn't found.
			if (!blogPost) {
				result.status = 'fail';
				result.data = { id: 'No blog post with that ID exists.' };

				return result;
			}

			result.status = 'success';
			result.data = { blogPost };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error deleting blog post.';
			result.data = { error };

			return result;
		});
}

module.exports = deleteBlogPost;
