// Responses are JSend-compliant JSON. (http://labs.omniti.com/labs/jsend)

/**
 * Requires that a user is admin before proceeding. In case of an error or
 * non-admin user, responses are JSend-compliant JSON.
 * @param {object} req - Express.js Request object.
 * @param {string} [req.decoded] - Decoded JSON web token payload.
 * @param {bool} [req.decoded.admin] - User's admin status.
 * @param {object} res - Express.js Response object.
 * @param {function} next - Function to procceed to the next Express.js
 * middleware.
 */
function requireAdmin(req, res, next) {
	const user = req.decoded;

	if (user && user.admin) {
		// User is an admin, access granted.
		next();
	} else {
		// No payload. (403 Forbidden)
		res.status(403).json({
			status: 'fail',
			data: {
				admin: 'You must be an admin to perform this action.',
			},
		});
	}
}

module.exports = requireAdmin;
