const db = require('../db');
const roles = require('../../lib/user-roles');

/**
 * Attempts to create a blog post.
 * @param {string} title - The blog post title.
 * @param {string[]} tags - The blog post tags.
 * @param {string} body - The blog post body.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the blog post will be returned in the result's `data.blogPost`
 * property.
 */
async function createBlogPost(title, tags, body, requestingUser) {
	const result = {};

	// Fail if requesting user isn't an admin.
	if (requestingUser.role !== roles.ADMIN) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	const author = requestingUser.name;
	const created = new Date().toISOString();

	// Build query string and values.
	let queryStr = 'INSERT INTO blogPosts (title, author, created';
	const values = [title, author, created];

	if (tags.length) {
		queryStr += ', tags';
		values.push(tags);
	}

	if (body.length) {
		queryStr += ', body';
		values.push(body);
	}

	queryStr += `) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')}) RETURNING *`;

	return db.one(queryStr, values)
		.then((blogPost) => {
			result.status = 'success';
			result.data = { blogPost };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error creating blog post.';
			result.data = { error };

			return result;
		});
}

module.exports = createBlogPost;
