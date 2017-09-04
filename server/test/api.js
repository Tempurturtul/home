import test from 'ava';
import request from 'supertest';
import emptyDB from './helpers/empty-db';
import populateDB from './helpers/populate-db';
import makeApp from './helpers/make-app';
import getToken from './helpers/get-token';
import getNextBlogPost from './helpers/get-next-blog-post';
import getBlogPost from './helpers/get-blog-post';
import getNextUser from './helpers/get-next-user';
import getUser from './helpers/get-user';
import testData from './helpers/test-data.json';

const admin = testData.users.admin;
const user = testData.users.normal;

const app = makeApp();

// Before any tests...
test.before(async () => {
	// Delete everything from the database.
	await emptyDB();

	// Populate the database with test data.
	await populateDB();
});

// After all tests, regardless of errors...
test.after.always(async () => {
	// Delete everything from the database.
	await emptyDB();
});

// POST /api/v1/authenticate

test('POST /api/v1/authenticate - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: admin.name, password: admin.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('POST /api/v1/authenticate - fail, wrong password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: admin.name, password: `${admin.password}123` });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, no password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: admin.name, password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, wrong name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: `${admin.name}123`, password: admin.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, no name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: '', password: admin.password });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/authenticate - fail, no name nor password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({ name: '', password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

// POST /api/v1/users

test('POST /api/v1/users - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('POST /api/v1/users - fail, name exists', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: admin.name, password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '.', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: 'a' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, no name nor password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '', password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test('POST /api/v1/users - fail, invalid name and password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '.', password: 'a' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

// GET /api/v1/users

test('GET /api/v1/users - success', async (t) => {
	t.plan(3);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.get('/api/v1/users')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('GET /api/v1/users - fail, no token', async (t) => {
	t.plan(4);

	const res = await request(app)
		.get('/api/v1/users');

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.admin, undefined);
});

test('GET /api/v1/users - fail, not admin', async (t) => {
	t.plan(4);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.get('/api/v1/users')
		.send({ token });

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.admin, undefined);
});

// GET /api/v1/users/:name

test('GET /api/v1/users/:name - success', async (t) => {
	t.plan(4);

	const token = await getToken(app, admin.name, admin.password);

	const name = user.name;

	const res = await request(app)
		.get(`/api/v1/users/${name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.is(res.body.data.name, user.name);
	t.is(res.body.data.admin, false);
});

test('GET /api/v1/users/:name - fail, wrong name', async (t) => {
	t.plan(3);

	const token = await getToken(app, admin.name, admin.password);

	const name = 'foofoofolomosho';

	const res = await request(app)
		.get(`/api/v1/users/${name}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
});

test('GET /api/v1/users/:name - fail, no token', async (t) => {
	t.plan(4);

	const name = user.name;

	const res = await request(app)
		.get(`/api/v1/users/${name}`);

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.admin, undefined);
});

test('GET /api/v1/users/:name - fail, not admin', async (t) => {
	t.plan(4);

	const token = await getToken(app, user.name, user.password);

	const name = user.name;

	const res = await request(app)
		.get(`/api/v1/users/${name}`)
		.send({ token });

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.admin, undefined);
});

// PUT /api/v1/users/:name

test.skip('PUT /api/v1/users/:name - success, full', async (t) => {
	t.plan(5);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);

	// Get a user to modify.
	const originalUser = await getNextUser(app);

	// Define new user data.
	const modifiedUser = {
		name: `${originalUser.name} modified`,
		password: 'new password 123',
		admin: true,
	};

	const res = await request(app)
		.put(`/api/v1/users/${originalUser.name}`)
		.send({
			token,
			name: modifiedUser.name,
			password: modifiedUser.password,
			admin: modifiedUser.admin,
		});

	// Retrieve the newly modified user.
	const retrievedUser = await getUser(app, res.body.data.name);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
	t.deepEqual({
		name: modifiedUser.name,
		admin: modifiedUser.admin,
	}, retrievedUser);

	// Test the new password.
	try {
		const modifiedUserToken = await getToken(app, modifiedUser.name, modifiedUser.password);
		t.not(modifiedUserToken, undefined);
	} catch (e) {
		t.fail();
	}
});

// DELETE /api/v1/users/:name

// TODO

// POST /api/v1/blog-posts

test('POST /api/v1/blog-posts - success, full', async (t) => {
	t.plan(5);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);
	// Assemble expected blog post data.
	// (Exclude time of day from timestamps to allow slight variation.)
	const post = {
		title: 'Foo',
		author: admin.name,
		created: new Date().toLocaleDateString(),
		modified: null,
		tags: [
			'maximum',
			'overdrive',
		],
		body: '<p>Lorem ipsum etc.</p>',
	};

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: post.title,
			tags: post.tags,
			body: post.body,
		});

	// Retrieve the newly created blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.id);
	// Exclude time of day from created timestamp to match expected.
	retrievedPost.created = new Date(retrievedPost.created).toLocaleDateString();

	// Add the returned id to the expected blog post data.
	post.id = retrievedPost.id;

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
	t.not(res.body.data.id, undefined);
	t.deepEqual(post, retrievedPost);
});

test('POST /api/v1/blog-posts - success, minimum', async (t) => {
	t.plan(5);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);
	// Assemble expected blog post data.
	// (Exclude time of day from timestamps to allow slight variation.)
	const post = {
		title: 'Foo',
		author: admin.name,
		created: new Date().toLocaleDateString(),
		modified: null,
		tags: null,
		body: null,
	};

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: post.title,
		});

	// Retrieve the newly created blog post.
	const retrievedPost = await getBlogPost(app, res.body.data.id);
	// Exclude time of day from created timestamp to match expected.
	retrievedPost.created = new Date(retrievedPost.created).toLocaleDateString();

	// Add the returned id to the expected blog post data.
	post.id = retrievedPost.id;

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
	t.not(res.body.data.id, undefined);
	t.deepEqual(post, retrievedPost);
});

test('POST /api/v1/blog-posts - fail, no title', async (t) => {
	t.plan(5);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: '',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.title, undefined);
	t.is(res.body.data.admin, undefined);
});

test('POST /api/v1/blog-posts - fail, no token', async (t) => {
	t.plan(5);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			title: 'Foo',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.is(res.body.data.admin, undefined);
});

test('POST /api/v1/blog-posts - fail, not admin', async (t) => {
	t.plan(5);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: 'Foo',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.not(res.body.data.admin, undefined);
});

// GET /api/v1/blog-posts

test('GET /api/v1/blog-posts - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts');

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

// GET /api/v1/blog-posts/:id

test('GET /api/v1/blog-posts/:id - success', async (t) => {
	t.plan(3);

	const blogPost = await getNextBlogPost(app);

	const res = await request(app)
		.get(`/api/v1/blog-posts/${blogPost.id}`);

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
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
	const token = await getToken(app, admin.name, admin.password);

	// Get a blog post to modify.
	const originalPost = await getNextBlogPost(app);

	// Define new blog post data.
	// (Exclude time of day from timestamps to allow slight variation.)
	const post = {
		id: originalPost.id,
		title: `${originalPost.title} modified`,
		author: originalPost.author,
		created: originalPost.created,
		modified: new Date().toLocaleDateString(),
		tags: originalPost.tags.concat(['modified']),
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
	const retrievedPost = await getBlogPost(app, res.body.data.id);
	// Exclude time of day from modified timestamp to match expected.
	retrievedPost.modified = new Date(retrievedPost.modified).toLocaleDateString();

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
	t.deepEqual(post, retrievedPost);
});

test('PUT /api/v1/blog-posts/:id - success, no changes', async (t) => {
	t.plan(4);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);

	// Get a blog post to modify.
	const originalPost = await getNextBlogPost(app);

	// Define new blog post data.
	// (Exclude time of day from timestamps to allow slight variation.)
	const post = {
		id: originalPost.id,
		title: originalPost.title,
		author: originalPost.author,
		created: originalPost.created,
		modified: new Date().toLocaleDateString(),
		tags: originalPost.tags,
		body: originalPost.body,
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
	const retrievedPost = await getBlogPost(app, res.body.data.id);
	// Exclude time of day from modified timestamp to match expected.
	retrievedPost.modified = new Date(retrievedPost.modified).toLocaleDateString();

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
	t.deepEqual(post, retrievedPost);
});

test('PUT /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(6);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.put('/api/v1/blog-posts/12300')
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.is(res.body.data.admin, undefined);
	t.not(res.body.data.id, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, invalid id', async (t) => {
	t.plan(6);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.put('/api/v1/blog-posts/abc')
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.is(res.body.data.admin, undefined);
	t.not(res.body.data.id, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, no token', async (t) => {
	t.plan(5);

	const originalPost = await getNextBlogPost(app);

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			title: 'Pizza',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.is(res.body.data.admin, undefined);
});

test('PUT /api/v1/blog-posts/:id - fail, not admin', async (t) => {
	t.plan(5);

	const originalPost = await getNextBlogPost(app);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.put(`/api/v1/blog-posts/${originalPost.id}`)
		.send({
			token,
			title: 'Pizza',
		});

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.is(res.body.data.title, undefined);
	t.not(res.body.data.admin, undefined);
});

// DELETE /api/v1/blog-posts/:id

test('DELETE /api/v1/blog-posts/:id - success', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);

	const blogPost = await getNextBlogPost(app);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(3);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);

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
	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.delete('/api/v1/blog-posts/abc')
		.send({ token });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.id, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, no token', async (t) => {
	t.plan(3);

	const blogPost = await getNextBlogPost(app);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send();

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.token, undefined);
});

test('DELETE /api/v1/blog-posts/:id - fail, not admin', async (t) => {
	t.plan(4);

	const blogPost = await getNextBlogPost(app);

	const token = await getToken(app, user.name, user.password);

	const res = await request(app)
		.delete(`/api/v1/blog-posts/${blogPost.id}`)
		.send({ token });

	t.is(res.status, 403);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.token, undefined);
	t.not(res.body.data.admin, undefined);
});
