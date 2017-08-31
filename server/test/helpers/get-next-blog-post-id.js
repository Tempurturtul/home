import request from 'supertest';

let counter = 0;

async function getNextBlogPostID(app) {
	const res = await request(app)
		.get('/api/v1/blog-posts');

	const index = counter;
	counter++;

	if (counter >= res.body.data.length) {
		throw new Error('No more unused blog post IDs. Increase number of blog posts in test database.');
	}

	return res.body.data[index].id;
}

export default getNextBlogPostID;
