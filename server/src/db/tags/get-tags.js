const db = require('../db');

/**
 * Attempts to get tags.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the list of tags will be returned in the result's `data.tags`
 * property.
 */
async function getTags() {
	const result = {};

	return db.any('SELECT name FROM tags')
		.then((tags) => {
			result.status = 'success';
			result.data = { tags };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error retrieving tags.';
			result.data = { error };

			return result;
		});
}

module.exports = getTags;
