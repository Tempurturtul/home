import request from 'supertest';

async function getBlogPostID(app) {
	const res = await request(app)
		.get('/api/v1/blog-posts');

	return res.body.data[0].id;
}

export default getBlogPostID;
