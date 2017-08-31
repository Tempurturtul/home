import test from 'ava';
import request from 'supertest';
import emptyDB from './helpers/empty-db';
import populateDB from './helpers/populate-db';
import makeApp from './helpers/make-app';
import getToken from './helpers/get-token';
import getBlogPostID from './helpers/get-blog-post-id';
import getBlogPost from './helpers/get-blog-post';
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

test.skip('POST /api/v1/users - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test.skip('POST /api/v1/users - fail, name exists', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: admin.name, password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, invalid name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '.', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, no name', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '', password: 'Pattycakes' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.is(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, invalid password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: 'a' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, no password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: 'Barry Boron', password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, no name nor password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '', password: '' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

test.skip('POST /api/v1/users - fail, invalid name and password', async (t) => {
	t.plan(4);

	const res = await request(app)
		.post('/api/v1/users')
		.send({ name: '.', password: 'a' });

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.name, undefined);
	t.not(res.body.data.password, undefined);
});

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

test('GET /api/v1/blog-posts - success', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts');

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('GET /api/v1/blog-posts/:id - success', async (t) => {
	t.plan(3);

	const id = await getBlogPostID(app);

	const res = await request(app)
		.get(`/api/v1/blog-posts/${id}`);

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

test('POST /api/v1/blog-posts - success, full', async (t) => {
	t.plan(5);

	// Get an admin token.
	const token = await getToken(app, admin.name, admin.password);
	// Assemble expected blog post data.
	// (Exclude time of day from timestamps to allow slight variation.)
	const post = {
		title: 'Foo',
		author: admin.name,
		created: new Date().toISOString().split('T')[0],
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
	// Trim time of day from created timestamp to match expected.
	retrievedPost.created = retrievedPost.created.split('T')[0];

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
		created: new Date().toISOString().split('T')[0],
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
	// Trim time of day from created timestamp to match expected.
	retrievedPost.created = retrievedPost.created.split('T')[0];

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
