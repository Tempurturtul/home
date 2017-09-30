const router = require('express').Router();
const db = require('../db');
const verifyJWT = require('../lib/middleware/verify-jwt');

router.post('/authenticate', async (req, res) => {
	const name = req.body.name || '';
	const password = req.body.password || '';
	const result = await db.authenticate(name, password);

	res.json(result);
});

router.post('/users', async (req, res) => {
	const name = req.body.name || '';
	const password = req.body.password || '';
	const result = await db.users.create(name, password);

	res.json(result);
});

router.get('/blog-posts', async (req, res) => {
	const result = await db.blogPosts.getAll();

	res.json(result);
});

router.get('/blog-posts/:id', async (req, res) => {
	const id = Number(req.params.id);
	const result = await db.blogPosts.get(id);

	res.json(result);
});

// Route middleware to require and verify tokens for following routes.
router.use(verifyJWT);

router.get('/users', async (req, res) => {
	const requestingUser = req.decoded;
	const result = await db.users.getAll(requestingUser);

	res.json(result);
});

router.get('/users/:name', async (req, res) => {
	const name = req.params.name;
	const requestingUser = req.decoded;
	const result = await db.users.get(name, requestingUser);

	res.json(result);
});

router.put('/users/:name', async (req, res) => {
	const name = req.params.name;
	const updates = {};

	if (req.body.name) {
		updates.name = req.body.name;
	}

	if (req.body.password) {
		updates.password = req.body.password;
	}

	if (req.body.role) {
		updates.role = req.body.role;
	}

	const requestingUser = req.decoded;
	const result = await db.users.update(name, updates, requestingUser);

	res.json(result);
});

router.delete('/users/:name', async (req, res) => {
	const name = req.params.name;
	const requestingUser = req.decoded;
	const result = await db.users.remove(name, requestingUser);

	res.json(result);
});

router.post('/blog-posts', async (req, res) => {
	const title = req.body.title || '';
	const tags = req.body.tags || [];
	const body = req.body.body || '';
	const requestingUser = req.decoded;
	const result = await db.blogPosts.create(title, tags, body, requestingUser);

	res.json(result);
});

router.put('/blog-posts/:id', async (req, res) => {
	const id = Number(req.params.id);
	const updates = {};

	if (req.body.title) {
		updates.title = req.body.title;
	}

	if (req.body.tags) {
		updates.tags = req.body.tags;
	}

	if (req.body.body) {
		updates.body = req.body.body;
	}

	const requestingUser = req.decoded;
	const result = await db.blogPosts.update(id, updates, requestingUser);

	res.json(result);
});

router.delete('/blog-posts/:id', async (req, res) => {
	const id = Number(req.params.id);
	const requestingUser = req.decoded;
	const result = await db.blogPosts.remove(id, requestingUser);

	res.json(result);
});

module.exports = router;
