import test from 'ava';
import request from 'supertest';
import emptyDB from './helpers/empty-db';
import populateDB from './helpers/populate-db';
import makeApp from './helpers/make-app';
import getToken from './helpers/get-token';
import testData from './helpers/test-data.json';

const admin = testData.users.admin;

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

	const res = await request(app)
		.get('/api/v1/blog-posts/1');

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('GET /api/v1/blog-posts/:id - fail, wrong id', async (t) => {
	t.plan(3);

	const res = await request(app)
		.get('/api/v1/blog-posts/123');

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
	t.plan(3);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: 'Foo',
			author: 'bar mar',
			tags: [
				'maximum',
				'overdrive',
			],
			body: '<p>Lorem ipsum etc.</p>',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('POST /api/v1/blog-posts - success, minimum', async (t) => {
	t.plan(3);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: 'Foo',
			author: 'bar mar',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'success');
	t.not(res.body.data, undefined);
});

test('POST /api/v1/blog-posts - fail, no title', async (t) => {
	t.plan(4);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: '',
			author: 'bar mar',
			tags: [
				'maximum',
				'overdrive',
			],
			body: '<p>Lorem ipsum etc.</p>',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.not(res.body.data.title, undefined);
	t.is(res.body.data.author, undefined);
});

test('POST /api/v1/blog-posts - fail, no author', async (t) => {
	t.plan(4);

	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({
			token,
			title: 'Foo',
			author: '',
			tags: [
				'maximum',
				'overdrive',
			],
			body: '<p>Lorem ipsum etc.</p>',
		});

	t.is(res.status, 200);
	t.is(res.body.status, 'fail');
	t.is(res.body.data.title, undefined);
	t.not(res.body.data.author, undefined);
});
