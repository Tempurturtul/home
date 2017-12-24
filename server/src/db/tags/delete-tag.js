const db = require('../db');

/**
 * Attempts to delete a specific tag.
 * @param {string} name - The name of the target tag.
 * @return {object} The result of the attempt as a JSend-format object. If
 * successful, the tag will be returned in the result's `data.tag` property.
 */
async function deleteTag(name) {
	const result = {};

	// TODO Explicit return.
	return db.oneOrNone('DELETE FROM tags WHERE name = $1 RETURNING *', [name])
		.then((tag) => {
			// Fail if tag wasn't found.
			if (!tag) {
				result.status = 'fail';
				result.data = { name: 'No tag with that name exists.' };

				return result;
			}

			result.status = 'success';
			result.data = { tag };

			return result;
		})
		.catch((error) => {
			result.status = 'error';
			result.message = 'Error deleting tag.';
			result.data = { error };

			return result;
		});
}

module.exports = deleteTag;
