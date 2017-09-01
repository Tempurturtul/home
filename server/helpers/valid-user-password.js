/**
 * Checks if password is a valid user password.
 * @param {string} password - The user password to check.
 * @return {bool} - Whether or not the user password is valid.
 */
function validUserPassword(password) {
	// 8+ characters.
	const validLength = password.length >= 8;
	// No leading or trailing whitespace.
	const validStart = /[^\s]/.test(password[0]);
	const validEnd = /[^\s]/.test(password[password.length - 1]);

	return validLength &&
		validStart &&
		validEnd;
}

module.exports = validUserPassword;
