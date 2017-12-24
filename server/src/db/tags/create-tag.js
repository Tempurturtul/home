const db = require('../db');

/**
 * Attempts to create a tag.
 * @param {string} name - The tag name.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the tag will be returned in the result's `data.tag` property.
 */
async function createTag(name) {
	const result = {};

	return db.one('INSERT INTO tags VALUES name = $1 RETURNING name', [name])
		.then((tag) => {
			result.status = 'success';
			result.data = { tag };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error creating tag.';
			result.data = { error };

			return result;
		});
}

module.exports = createTag;
