const db = require('../db');

/**
 * Attempts to get a specific blog post.
 * @param {number} id - The ID of the target blog post.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the blog post will be returned in the result's `data.blogPost`
 * property.
 */
async function getBlogPost(id) {
	const result = {};

	// Fail if ID isn't an integer.
	if (!Number.isSafeInteger(id)) {
		result.status = 'fail';
		result.data = { id: 'ID must be an integer.' };

		return result;
	}

	return db.oneOrNone('SELECT id, title, created, modified, author, body FROM blog_posts WHERE id = $1', [id])
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
			result.message = 'Error retrieving blog post.';
			result.data = { error };

			return result;
		});
}

module.exports = getBlogPost;
