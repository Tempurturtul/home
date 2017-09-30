/**
 * Checks if name is a valid user name.
 * @param {string} name - The user name to check.
 * @return {bool} Whether or not the user name is valid.
 */
function validUserName(name) {
	// 3-32 characters.
	const validLength = name.length >= 3 && name.length <= 32;
	// Letters, digits, and whitespace only, with no leading or trailing whitespace.
	const validChars = /^[a-zA-Z0-9][a-zA-Z0-9\s]+[a-zA-Z0-9]$/.test(name);
	// No groups of 2+ whitespace.
	const validWhitespace = !(/\s{2,}/.test(name));

	return validLength && validChars && validWhitespace;
}

module.exports = validUserName;
