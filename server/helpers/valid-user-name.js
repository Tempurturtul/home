/**
 * Checks if name is a valid user name.
 * @param {string} name - The user name to check.
 * @return {bool} - Whether or not the user name is valid.
 */
function validUserName(name) {
	// 3+ characters.
	const validLength = name.length >= 3;
	// Letters, digits, and whitespace only.
	const validChars = /^[a-zA-Z0-9\s]+$/.test(name);
	// No leading or trailing whitespace.
	const validStart = /[^\s]/.test(name[0]);
	const validEnd = /[^\s]/.test(name[name.length - 1]);
	// No groups of 2+ whitespace.
	const validSpaces = !(/\s{2,}/.test(name));

	return validLength &&
		validChars &&
		validStart &&
		validEnd &&
		validSpaces;
}

module.exports = validUserName;
