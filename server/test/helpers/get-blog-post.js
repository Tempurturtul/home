import request from 'supertest';

async function getBlogPost(app, id) {
	const res = await request(app)
		.get(`/api/v1/blog-posts/${id}`);

	if (res.body.status !== 'success') {
		console.error(res.body.data);
		throw new Error(`Failed to get blog post ${id}`);
	}

	const blogPost = res.body.data.blogPost;

	return blogPost;
}

export default getBlogPost;
