const db = require('../db');

/**
 * Attempts to update a tag.
 * @param {string} name - The tag's name.
 * @param {object} updates - The updates for the target tag.
 * @param {string} updates.name - The new name.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the tag will be returned in the result's `data.tag` property.
 */
async function updateTag(name, updates) {
	const result = {};

	return db.one('UPDATE tags SET name = $2 WHERE name = $1 RETURNING name', [name, updates.name])
		.then((tag) => {
			result.status = 'success';
			result.data = { tag };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error updating tag.';
			result.data = { error };

			return result;
		});
}

module.exports = updateTag;
