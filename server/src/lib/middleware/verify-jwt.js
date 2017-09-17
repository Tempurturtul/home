// Responses are JSend-compliant JSON. (http://labs.omniti.com/labs/jsend)

const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * Verifies a JSON web token and adds the decoded payload to the request's
 * `decoded` property. In case of an error or invalid token, responses are
 * JSend-compliant JSON.
 * @param {object} req - Express.js Request object.
 * @param {object} req.body - Data submitted in the request body.
 * @param {string} [req.body.token] - The JSON web token.
 * @param {object} res - Express.js Response object.
 * @param {function} next - Function to procceed to the next Express.js
 * middleware.
 */
function verifyJWT(req, res, next) {
	// Check for a token.
	const token = req.body.token;

	if (token) {
		// Decode the token.
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				// Invalid or expired token. (403 Forbidden)
				res.status(403).json({
					status: 'fail',
					data: { token: 'Your access token is invalid or expired.' },
				});
			} else {
				// Pass along the decoded payload.
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// No token. (403 Forbidden)
		res.status(403).json({
			status: 'fail',
			data: { token: 'An access token is required.' },
		});
	}
}

module.exports = verifyJWT;
