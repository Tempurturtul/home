// Responses are JSend-compliant JSON. (http://labs.omniti.com/labs/jsend)

const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const config = require('../config');

const db = pgp(config.database);

/**
 * Provides a signed JSON web token in the data portion of the JSON response if
 * the user name and password are successfully authenticated. The token payload
 * contains the user's data as retrieved from the database. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.body - Data submitted in the request body.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.password - The user's password.
 * @param {object} res - Express.js Response object.
 */
function authenticate(req, res) {
	const { name, password } = req.body;

	if (!name || !password) {
		const data = {};

		if (!name) {
			data.name = 'A name is required.';
		}

		if (!password) {
			data.password = 'A password is required.';
		}

		res.json({
			status: 'fail',
			data,
		});
	} else {
		db.oneOrNone('SELECT * FROM users WHERE name=$1', [name])
			.then((data) => {
				if (!data) {
					res.json({
						status: 'fail',
						data: {
							name: 'No user with that name exists.',
						},
					});
				} else {
					const user = data;

					// Check password.
					if (user.password !== password) {
						res.json({
							status: 'fail',
							data: {
								password: 'Wrong password.',
							},
						});
					} else {
						// Create a token.
						const token = jwt.sign(user, config.secret, {
							expiresIn: '10m', 	// Expires in 10 minutes.
						});

						res.json({
							status: 'success',
							data: token,
						});
					}
				}
			})
			.catch((err) => {
				res.json({
					status: 'error',
					message: 'Error logging in.',
					data: err,
				});
			});
	}
}

/**
 * Provides an array of all blog posts in the data portion of the JSON response
 * if the request is successful. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} res - Express.js Response object.
 */
function getBlogPosts(req, res) {
	db.any('SELECT * FROM blogPosts ORDER BY created')
		.then((data) => {
			res.json({
				status: 'success',
				data,
			});
		})
		.catch((err) => {
			res.json({
				status: 'error',
				message: 'Error retrieving blog posts.',
				data: err,
			});
		});
}

/**
 * Provides the blog post matching the ID in the data portion of the JSON
 * response if the ID matches any blog post. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.params - Data submitted as route parameters.
 * @param {string|number} req.params.id - The blog post ID. Must be an integer or
 * string representation of an integer.
 * @param {object} res - Express.js Response object.
 */
function getBlogPostById(req, res) {
	const id = Number(req.params.id);

	if (!Number.isInteger(id)) {
		res.json({
			status: 'fail',
			data: {
				id: 'An integer id is required.',
			},
		});
	} else {
		db.oneOrNone('SELECT * FROM blogPosts WHERE id=$1', [id])
			.then((data) => {
				if (!data) {
					res.json({
						status: 'fail',
						data: {
							id: 'No blog post with that ID exists.',
						},
					});
				} else {
					res.json({
						status: 'success',
						data,
					});
				}
			})
			.catch((err) => {
				res.json({
					status: 'error',
					message: 'Error retrieving blog post.',
					data: err,
				});
			});
	}
}

/**
 * Provides the result of inserting a blog post in the data portion of the JSON
 * response if the blog post is successfully inserted. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.decoded - Decoded JSON web token payload, automatically
 * provided by middleware.
 * @param {bool} req.decoded.name - User's name.
 * @param {object} req.body - Data submitted in the request body.
 * @param {string} [req.body.title] - The blog post title.
 * @param {string[]} [req.body.tags] - The blog post tags.
 * @param {string} [req.body.body] - The blog post body.
 * @param {object} res - Express.js Response object.
 */
function createBlogPost(req, res) {
	const { title, tags, body } = req.body;
	const author = req.decoded.name;
	const created = new Date().toISOString();

	if (!title) {
		res.json({
			status: 'fail',
			data: {
				title: 'A title is required.',
			},
		});
	} else {
		const queryStr = 'INSERT INTO ' +
			'blogPosts(title, author, created, tags, body) ' +
			'VALUES($1, $2, $3, $4, $5) ' +
			'RETURNING id';

		db.one(queryStr, [title, author, created, tags, body])
			.then((data) => {
				res.json({
					status: 'success',
					data,
				});
			})
			.catch((err) => {
				res.json({
					status: 'error',
					message: 'Error creating blog post.',
					data: err,
				});
			});
	}
}

/**
 * Provides the result of updating a blog post in the data portion of the JSON
 * response if the blog post is successfully updated. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.decoded - Decoded JSON web token payload, automatically
 * provided by middleware.
 * @param {bool} req.decoded.name - User's name.
 * @param {object} req.params - Data submitted as route parameters.
 * @param {string|number} req.params.id - The blog post ID. Must be an integer or
 * string representation of an integer.
 * @param {object} req.body - Data submitted in the request body.
 * @param {string} [req.body.title] - The blog post title.
 * @param {string[]} [req.body.tags] - The blog post tags.
 * @param {string} [req.body.body] - The blog post body.
 * @param {object} res - Express.js Response object.
 */
function updateBlogPost(req, res) {
	const id = Number(req.params.id);

	if (!Number.isInteger(id)) {
		res.json({
			status: 'fail',
			data: {
				id: 'An integer id is required.',
			},
		});
	} else {
		const { title, tags, body } = req.body;
		const modified = new Date().toISOString();

		const queryStr = 'UPDATE blogPosts ' +
			'SET title = $2, modified = $3, tags = $4, body = $5 ' +
			'WHERE id = $1 ' +
			'RETURNING id';

		db.one(queryStr, [id, title, modified, tags, body])
			.then((data) => {
				res.json({
					status: 'success',
					data,
				});
			})
			.catch((err) => {
				res.json({
					status: 'error',
					message: 'Error updating blog post.',
					data: err,
				});
			});
	}
}

module.exports = {
	authenticate,
	getBlogPosts,
	getBlogPostById,
	createBlogPost,
	updateBlogPost,
	database: db, 	// The actual database instance.
};
