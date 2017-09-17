import test from 'ava';
import request from 'supertest';
import makeApp from './helpers/make-app';
import emptyDB from './helpers/empty-db';
import getAdminToken from './helpers/get-admin-token';
import getToken from './helpers/get-token';
import createUser from './helpers/create-user';
import getUser from './helpers/get-user';
import createBlogPost from './helpers/create-blog-post';
import getBlogPost from './helpers/get-blog-post';
import roles from '../src/lib/user-roles';

const app = makeApp();

// Before any tests...
test.before(async () => {
	// Delete everything from the database.
	await emptyDB();
	// Call getAdminToken once to initialize.
	await getAdminToken(app);
});

// After all tests, regardless of errors...
test.after.always(async () => {
	// Delete everything from the database.
	await emptyDB();
});

// POST /api/v1/authenticate

test('POST /api/v1/authenticate - success', async (t) => {
	t.plan(3);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.token, undefined);
});

test('POST /api/v1/authenticate - fail, wrong password', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: user.name, password: 'wrong' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, no password', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: user.name, password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, wrong name', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: 'wrong', password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, no name', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: '', password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

// POST /api/v1/users

test('POST /api/v1/users - success', async (t) => {
	t.plan(3);

	const user = {
		name: 'create success user',
		password: 'password',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.user, undefined);
});

test('POST /api/v1/users - fail, name exists', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid name', async (t) => {
	t.plan(4);

	const user = {
		name: '.',
		password: 'password',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no name', async (t) => {
	t.plan(4);

	const user = {
		name: '',
		password: 'password',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid password', async (t) => {
	t.plan(4);

	const user = {
		name: 'invalid pass user',
		password: 'a',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no password', async (t) => {
	t.plan(4);

	const user = {
		name: 'no pass user',
		password: '',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no name nor password', async (t) => {
	t.plan(4);

	const user = {
		name: '',
		password: '',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid name and password', async (t) => {
	t.plan(4);

	const user = {
		name: '.',
		password: 'a',
	};

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: user.name, password: user.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

// GET /api/v1/users

test('GET /api/v1/users - success', async (t) => {
	t.plan(3);

	const token = await getAdminToken(app);

	const res = await request(app)
		.get('/api/v1/users')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.users, undefined);
});

test('GET /api/v1/users - fail, no token', async (t) => {
	t.plan(4);

	const res = await request(app)
		.get('/api/v1/users');

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
});

test('GET /api/v1/users - fail, not admin', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.get('/api/v1/users')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// GET /api/v1/users/:name

test('GET /api/v1/users/:name - success, admin', async (t) => {
	t.plan(4);

	const token = await getAdminToken(app);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.get(`/api/v1/users/${user.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.is(res.body.data.user.name, user.name);
	t.is(res.body.data.user.role, user.role);
});

test('GET /api/v1/users/:name - success, self', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.get(`/api/v1/users/${user.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.is(res.body.data.user.name, user.name);
	t.is(res.body.data.user.role, user.role);
});

test('GET /api/v1/users/:name - fail, wrong name', async (t) => {
	t.plan(3);

	const token = await getAdminToken(app);

	const res = await request(app)
		.get('/api/v1/users/poppyloppysnopcakes')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
});

test('GET /api/v1/users/:name - fail, no token', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.get(`/api/v1/users/${user.name}`);

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
});

test('GET /api/v1/users/:name - fail, not admin nor self', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const token = await getToken(app, user.name, user.password);

	const otherUser = await createUser(app, roles.USER);

	const res = await request(app)
		.get(`/api/v1/users/${otherUser.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// PUT /api/v1/users/:name

test('PUT /api/v1/users/:name - success, full admin', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	// Define new user data.
	const modifiedUser = {
		name: `${originalUser.name}_modified`,
		password: 'modified password',
		role: roles.ADMIN,
	};

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: modifiedUser.name,
			password: modifiedUser.password,
			role: modifiedUser.role,
		});

	// Retrieve the newly modified user.
	const retrievedUser = await getUser(app, res.body.data.user.name);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.deepEqual({
		name: modifiedUser.name,
		role: modifiedUser.role,
	}, retrievedUser);

	// Test the new password.
	try {
		const retrievedToken = await getToken(app, modifiedUser.name, modifiedUser.password);
		t.not(retrievedToken, undefined);
	} catch (e) {
		t.fail(e);
	}
});

test('PUT /api/v1/users/:name - success, full self', async (t) => {
	t.plan(4);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	// Get the user's token.
	const token = await getToken(app, originalUser.name, originalUser.password);

	// Define new user data.
	const modifiedUser = {
		name: `${originalUser.name}_modified`,
		password: 'modified password',
		// Can't change role.
		role: roles.USER,
	};

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: modifiedUser.name,
			password: modifiedUser.password,
		});

	// Retrieve the newly modified user.
	const retrievedUser = await getUser(app, res.body.data.user.name);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.deepEqual({
		name: modifiedUser.name,
		role: modifiedUser.role,
	}, retrievedUser);

	// Test the new password.
	try {
		const retrievedToken = await getToken(app, modifiedUser.name, modifiedUser.password);
		t.not(retrievedToken, undefined);
	} catch (e) {
		t.fail(e);
	}
});

test('PUT /api/v1/users/:name - success, no changes', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: originalUser.name,
		});

	// Retrieve the newly modified user.
	const retrievedUser = await getUser(app, res.body.data.user.name);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.deepEqual({
		name: originalUser.name,
		role: originalUser.role,
	}, retrievedUser);

	// Test the password.
	try {
		const retrievedToken = await getToken(app, originalUser.name, originalUser.password);
		t.not(retrievedToken, undefined);
	} catch (e) {
		t.fail(e);
	}
});

test('PUT /api/v1/users/:name - fail, wrong name', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const res = await request(app)
		.put('/api/v1/users/poppyloppysnopcakes')
		.send({
			token,
			name: 'any name',
			role: roles.USER,
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
});

test('PUT /api/v1/users/:name - fail, no token', async (t) => {
	t.plan(4);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			name: originalUser.name,
			role: originalUser.role,
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
});

test('PUT /api/v1/users/:name - fail, not admin nor self', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	// Get a non-admin token.
	const token = await getToken(app, user.name, user.password);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: originalUser.name,
			role: originalUser.role,
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

test('PUT /api/v1/users/:name - fail, non-admin self role change', async (t) => {
	t.plan(4);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	// Get the user's token.
	const token = await getToken(app, originalUser.name, originalUser.password);

	// Define new user data.
	const modifiedUser = {
		name: `${originalUser.name}_modified`,
		password: 'modified password',
		role: roles.ADMIN,
	};

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: modifiedUser.name,
			password: modifiedUser.password,
			role: modifiedUser.role,
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// DELETE /api/v1/users/:name

test('DELETE /api/v1/users/:name - success, admin', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.delete(`/api/v1/users/${user.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.user, undefined);
});

test('DELETE /api/v1/users/:name - success, self', async (t) => {
	t.plan(3);

	// Get a user to modify.
	const user = await createUser(app, roles.USER);

	// Get the user's token.
	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.delete(`/api/v1/users/${user.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.user, undefined);
});

test('DELETE /api/v1/users/:name - fail, wrong name', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const res = await request(app)
		.delete('/api/v1/users/poppyloppysnopcakes')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
});

test('DELETE /api/v1/users/:name - fail, no token', async (t) => {
	t.plan(3);

	const user = await createUser(app, roles.USER);

	const res = await request(app)
		.delete(`/api/v1/users/${user.name}`)
		.send();

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
});

test('DELETE /api/v1/users/:name - fail, not admin nor self', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	// Get a non-admin token.
	const token = await getToken(app, user.name, user.password);

	// Get a user to modify.
	const originalUser = await createUser(app, roles.USER);

	const res = await request(app)
		.delete(`/api/v1/users/${originalUser.name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// POST /api/v1/blog-posts

test('POST /api/v1/blog-posts - success, full', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	const post = await createBlogPost(app);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: post.title,
			tags: post.tags,
			body: post.body,
		});

	// Retrieve the newly created blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.blogPost.id);

	// Don't compare IDs or created time minutes.
	post.id = undefined;
	retrievedPost.id = undefined;
	post.created = post.created.split(':')[0];
	retrievedPost.created = retrievedPost.created.split(':')[0];

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
	t.deepEqual(post, retrievedPost);
});

test('POST /api/v1/blog-posts - success, minimum', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	const post = await createBlogPost(app);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: post.title,
		});

	// Retrieve the newly created blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.blogPost.id);

	// Don't compare IDs or created time minutes.
	post.id = undefined;
	retrievedPost.id = undefined;
	post.created = post.created.split(':')[0];
	retrievedPost.created = retrievedPost.created.split(':')[0];

	// Normalize undefined data.
	post.body = null;
	post.tags = null;

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
	t.deepEqual(post, retrievedPost);
});

test('POST /api/v1/blog-posts - fail, no token', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			title: 'Foo',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
});

test('POST /api/v1/blog-posts - fail, not admin', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: 'Foo',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// GET /api/v1/blog-posts

test('GET /api/v1/blog-posts - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts');

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPosts, undefined);
});

// GET /api/v1/blog-posts/:id

test('GET /api/v1/blog-posts/:id - success', async (t) => {
	t.plan(3);

	const blogPost = await createBlogPost(app);

	const res = await request(app)
		.get(`/api/v1/blog-posts/${blogPost.id}`);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
});

test('GET /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts/12300');

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.id, undefined);
});

test('GET /api/v1/blog-posts/:id - fail, invalid id', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts/abc');

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.id, undefined);
});

// PUT /api/v1/blog-posts/:id

test('PUT /api/v1/blog-posts/:id - success, full', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	// Get a blog post to modify.
	const originalPost = await createBlogPost(app);

	// Define new blog post data.
	const post = {
		id: originalPost.id,
		title: `${originalPost.title} modified`,
		author: originalPost.author,
		created: originalPost.created,
		modified: new Date().toISOString(),
		tags: originalPost.tags ? originalPost.tags.concat(['modified']) : ['modified'],
		body: `${originalPost.body} modified`,
	};

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			token,
			title: post.title,
			tags: post.tags,
			body: post.body,
		});

	// Retrieve the newly modified blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.blogPost.id);

	// Don't compare modified timestamp minutes.
	post.modified = post.modified.split(':')[0];
	retrievedPost.modified = retrievedPost.modified.split(':')[0];

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
	t.deepEqual(post, retrievedPost);
});

test('PUT /api/v1/blog-posts/:id - success, no changes', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getAdminToken(app);

	// Get a blog post to modify.
	const originalPost = await createBlogPost(app);

	// Define new blog post data.
	const post = {
		id: originalPost.id,
		title: originalPost.title,
		author: originalPost.author,
		created: originalPost.created,
		modified: new Date().toISOString(),
		tags: originalPost.tags,
		body: originalPost.body,
	};

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			token,
		});

	// Retrieve the newly modified blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.blogPost.id);

	// Don't compare modified timestamp minutes.
	post.modified = post.modified.split(':')[0];
	retrievedPost.modified = retrievedPost.modified.split(':')[0];

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
	t.deepEqual(post, retrievedPost);
});

test('PUT /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(5);

	const token = await getAdminToken(app);

	const res = await request(app)
		.put('/api/v1/blog-posts/12300')
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
	t.not(res.body.data.id, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, invalid id', async (t) => {
	t.plan(5);

	const token = await getAdminToken(app);

	const res = await request(app)
		.put('/api/v1/blog-posts/abc')
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
	t.not(res.body.data.id, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, no token', async (t) => {
	t.plan(4);

	const originalPost = await createBlogPost(app);

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			title: 'Pizza',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.role, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, not admin', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);
	const originalPost = await createBlogPost(app);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});

// DELETE /api/v1/blog-posts/:id

test('DELETE /api/v1/blog-posts/:id - success', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const blogPost = await createBlogPost(app);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data.blogPost, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const res = await request(app)
		.delete('/api/v1/blog-posts/12300')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.id, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, invalid id', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getAdminToken(app);

	const res = await request(app)
		.delete('/api/v1/blog-posts/abc')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.id, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, no token', async (t) => {
	t.plan(3);

	const blogPost = await createBlogPost(app);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send();

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, not admin', async (t) => {
	t.plan(4);

	const user = await createUser(app, roles.USER);
	const blogPost = await createBlogPost(app);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.role, undefined);
});
