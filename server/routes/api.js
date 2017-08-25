// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');

// JSend status messages.
const status = {
	SUCCESS: 'success',
	FAIL: 'fail',
	ERROR: 'error',
};

// Unprotected routes.
router.post('/login', db.authenticate);
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// Route middleware to verify tokens.
router.use((req, res, next) => {
	// Check for a token.
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		// Decode the token.
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				// Invalid or expired token. (403 Forbidden)
				res.status(403).json({
					status: status.FAIL,
					data: {
						token: 'Your access token is invalid or expired.',
					},
				});
			} else {
				// Pass the decoded payload along for use in subsequent routes.
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// No token. (403 Forbidden)
		res.status(403).json({
			status: status.FAIL,
			data: {
				token: 'An access token is required.',
			},
		});
	}
});

// Protected routes.
router.post('/blog-posts', db.createBlogPost);

module.exports = router;
