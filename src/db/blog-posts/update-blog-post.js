const getBlogPost = require('./get-blog-post');
const db = require('../db');
const roles = require('../../lib/user-roles');

/**
 * Attempts to update a specific blog post.
 * @param {number} id - The ID of the target blog post.
 * @param {object} updates - The updates for the target blog post.
 * @param {string} [updates.title] - The new title.
 * @param {string} [updates.tags] - The new tags.
 * @param {string} [updates.body] - The new body.
 * @param {object} requestingUser - The requesting user.
 * @param {string} requestingUser.name - The requesting user's name.
 * @param {string} requestingUser.role - The requesting user's role.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the blog post will be returned in the result's `data.blogPost`
 * property.
 */
async function updateBlogPost(id, updates, requestingUser) {
	const result = {};

	// Fail if requesting user isn't an admin or contributor.
	if (requestingUser.role !== roles.ADMIN && requestingUser.role !== roles.CONTRIBUTOR) {
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

	// Attempt to get original blog post.
	const originalResult = await getBlogPost(id);

	// Fail if unable to get original.
	if (originalResult.status !== 'success') {
		result.status = 'fail';
		result.data = originalResult.data;

		return result;
	}

	// Fail if requesting user is a contributor and not the author.
	if (requestingUser.role === roles.CONTRIBUTOR &&
		requestingUser.name !== originalResult.data.blogPost.author
	) {
		result.status = 'fail';
		result.data = { role: 'You do not have access to this resource.' };

		return result;
	}

	const modified = new Date().toISOString();

	// Build query string and values.
	let queryStr = 'UPDATE blogPosts SET modified = $2';
	const values = [id, modified];

	if (updates.title) {
		queryStr += ', title = $3';
		values.push(updates.title);
	}

	if (updates.tags) {
		if (updates.title) {
			queryStr += ', tags = $4';
		} else {
			queryStr += ', tags = $3';
		}

		values.push(updates.tags);
	}

	if (updates.body) {
		if (updates.title && updates.tags) {
			queryStr += ', body = $5';
		} else if (updates.title || updates.tags) {
			queryStr += ', body = $4';
		} else {
			queryStr += ', body = $3';
		}

		values.push(updates.body);
	}

	queryStr += ' WHERE id = $1 RETURNING *';

	// No need to check if blog post exists since we've already succeeeded in retrieving the original.
	return db.one(queryStr, values)
		.then((blogPost) => {
			result.status = 'success';
			result.data = { blogPost };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error updating blog post.';
			result.data = { error };

			return result;
		});
}

module.exports = updateBlogPost;
