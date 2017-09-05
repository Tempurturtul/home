/**
 * Parses a password composite type retrieved from the database into an object.
 * @param {string} data - The raw password data retrieved from the database.
 * Originally in the form '(hash,salt,iterations)'.
 * @return {object} - The parsed password object, with hash, salt, and
 * iterations properties.
 */
function parsePasswordFromDB(data) {
	const password = {};
	let parsed = data;

	// Trim parentheses from beginning and end.
	parsed = parsed.slice(1, -1);
	// Split into array.
	parsed = parsed.split(',');

	// First element is the hash.
	password.hash = parsed[0];
	// Second element is the salt.
	password.salt = parsed[1];
	// Third element is the iterations in string form. Convert to number.
	password.iterations = Number(parsed[2]);

	return password;
}

module.exports = parsePasswordFromDB;
