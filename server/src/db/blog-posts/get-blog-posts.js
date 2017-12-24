const db = require('../db');

/**
 * Attempts to get blog posts.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the list of blog posts will be returned in the result's
 * `data.blogPosts` property.
 */
async function getBlogPosts() {
	const result = {};

	return db.any('SELECT id, title, created, modified, author, body FROM blog_posts ORDER BY created')
		.then((blogPosts) => {
			result.status = 'success';
			result.data = { blogPosts };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error retrieving blog posts.';
			result.data = { error };

			return result;
		});
}

module.exports = getBlogPosts;
