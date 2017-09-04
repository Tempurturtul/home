import request from 'supertest';

let counter = 0;

async function getNextBlogPost(app) {
	const res = await request(app)
		.get('/api/v1/blog-posts');

	if (counter >= res.body.data.length) {
		throw new Error('No more unused blog posts. Increase number of blog posts in test database.');
	}

	const blogPost = res.body.data[counter];

	counter++;

	return blogPost;
}

export default getNextBlogPost;
