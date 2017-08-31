import request from 'supertest';

async function getBlogPost(app, id) {
	const res = await request(app)
		.get(`/api/v1/blog-posts/${id}`);

	return res.body.data;
}

export default getBlogPost;
