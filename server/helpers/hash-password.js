const crypto = require('crypto');

/**
 * Hashes a password.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt used in the hash.
 * @param {number} iterations - Number of hash iterations.
 * @param {number} [outputBytes=32] - Number of bytes of output to take as the
 * final hash.
 * @return {string} - The hashed password as a hex string (and therefore double
 * the length the output bytes).
 */
function hashPassword(password, salt, iterations, outputBytes = 32) {
	// Byte length for generated key.
	const keylen = outputBytes;
	// HMAC digest algorithm applied to derive a key from the password, salt, and iterations.
	const digest = 'sha256';
	// Generated key.
	const key = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
	// Final hash. (Hash length of 64 because 4 bits per hex digit.)
	const hash = key.toString('hex');

	return hash;
}

module.exports = hashPassword;
