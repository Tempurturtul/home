import crypto from 'crypto';
import request from 'supertest';
import getAdminToken from './get-admin-token';

async function createBlogPost(app) {
	const token = await getAdminToken(app);

	// Blog post with random title, tags, and body.
	const title = crypto.randomBytes(16).toString('hex');
	const tags = crypto.randomBytes(128).toString('hex').split('9');
	const body = crypto.randomBytes(128).toString('hex');

	const res = await request(app)
		.post('/api/v1/blog-posts')
		.send({ token, title, tags, body });

	if (res.body.status !== 'success') {
		console.error(res.body.data);
		throw new Error('Failed to create blog post.');
	}

	const blogPost = res.body.data.blogPost;

	return blogPost;
}

export default createBlogPost;
