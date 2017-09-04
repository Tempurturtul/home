// Responses are JSend-compliant JSON. (http://labs.omniti.com/labs/jsend)

const crypto = require('crypto');
const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const config = require('../config');
const validUserName = require('../helpers/valid-user-name');
const validUserPassword = require('../helpers/valid-user-password');
const hashPassword = require('../helpers/hash-password');
const parsePasswordFromDB = require('../helpers/parse-password-from-db');

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

					// Convert data from format `'(hash,"salt",iterations)'` to `{hash, salt, iterations}`.
					user.password = parsePasswordFromDB(user.password);

					const hash = hashPassword(password, user.password.salt, user.password.iterations);

					// Check password.
					if (user.password.hash !== hash) {
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
 * Provides the result of inserting a user in the data portion of the JSON
 * response if the user is successfully inserted. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.body - Data submitted in the request body.
 * @param {string} [req.body.name] - The user name.
 * @param {string[]} [req.body.password] - The user password.
 * @param {object} res - Express.js Response object.
 */
function createUser(req, res) {
	const { name, password } = req.body;

	if (!name || !password) {
		const data = {};

		if (!name) {
			data.name = 'A name is required.';
		}

		if (!password) {
			data.password = 'A pasword is required.';
		}

		res.json({
			status: 'fail',
			data,
		});
	} else if (!validUserName(name) || !validUserPassword(password)) {
		const data = {};

		if (!validUserName(name)) {
			data.name = 'Invalid name, check requirements.';
		}

		if (!validUserPassword(password)) {
			data.password = 'Invalid password, check requirements.';
		}

		res.json({
			status: 'fail',
			data,
		});
	} else {
		// The number of hash iterations to perform. (40,000 recommended as of August 2017.)
		const iterations = 40000;
		// Get strong random salt. (16+ bytes recommended, 32 used.)
		const salt = crypto.randomBytes(32).toString('hex');
		// Number of bytes of output to take as the final hash.
		const outputBytes = 32;
		// Hash the password.
		const hash = hashPassword(password, salt, iterations, outputBytes);

		const queryStr = 'INSERT INTO ' +
			'users(name, password.hash, password.salt, password.iterations, admin) ' +
			'VALUES($1, $2, $3, $4, false) ' +
			'RETURNING name';

		db.one(queryStr, [name, hash, salt, iterations])
			.then((data) => {
				res.json({
					status: 'success',
					data,
				});
			})
			.catch((err) => {
				if (Number(err.code) === 23505) {
					// Name already exists. (23505 unique_violation)
					res.json({
						status: 'fail',
						data: {
							name: 'Name already exists.',
						},
					});
				} else {
					res.json({
						status: 'error',
						message: 'Error creating user.',
						data: err,
					});
				}
			});
	}
}

/**
 * Provides an array of all users in the data portion of the JSON response if
 * the request is successful. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} res - Express.js Response object.
 */
function getUsers(req, res) {
	db.any('SELECT name, admin FROM users')
		.then((data) => {
			res.json({
				status: 'success',
				data,
			});
		})
		.catch((err) => {
			res.json({
				status: 'error',
				message: 'Error retrieving users.',
				data: err,
			});
		});
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

		db.oneOrNone(queryStr, [id, title, modified, tags, body])
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
					message: 'Error updating blog post.',
					data: err,
				});
			});
	}
}

/**
 * Provides the result of deleting a blog post in the data portion of the JSON
 * response if the blog post is successfully deleted. JSend-compliant.
 * @param {object} req - Express.js Request object.
 * @param {object} req.decoded - Decoded JSON web token payload, automatically
 * provided by middleware.
 * @param {bool} req.decoded.name - User's name.
 * @param {object} req.params - Data submitted as route parameters.
 * @param {string|number} req.params.id - The blog post ID. Must be an integer or
 * string representation of an integer.
 * @param {object} res - Express.js Response object.
 */
function deleteBlogPost(req, res) {
	const id = Number(req.params.id);

	if (!Number.isInteger(id)) {
		res.json({
			status: 'fail',
			data: {
				id: 'An integer id is required.',
			},
		});
	} else {
		const queryStr = 'DELETE FROM blogPosts ' +
			'WHERE id = $1 ' +
			'RETURNING id';

		db.oneOrNone(queryStr, [id])
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
					message: 'Error deleting blog post.',
					data: err,
				});
			});
	}
}

module.exports = {
	authenticate,
	createUser,
	getUsers,
	createBlogPost,
	getBlogPosts,
	getBlogPostById,
	updateBlogPost,
	deleteBlogPost,
	database: db, 	// The actual database instance.
};
