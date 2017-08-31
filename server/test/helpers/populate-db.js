import db from '../../db';
import testData from './test-data.json';

async function populateDB() {
	const admin = testData.users.admin;
	const user = testData.users.normal;
	const fullPost = testData.blogPosts.full;
	const minPost = testData.blogPosts.minimum;

	const promises = [];

	await db.database.any('INSERT INTO users (name, password, admin) VALUES ($1, $2, $3)', [
		admin.name,
		admin.password,
		true,
	]);

	await db.database.any('INSERT INTO users (name, password, admin) VALUES ($1, $2, $3)', [
		user.name,
		user.password,
		false,
	]);

	// Add ten full blog posts.
	for (let i = 0; i < 25; i++) {
		promises.push(db.database.any('INSERT INTO blogPosts (title, author, created, modified, tags, body) VALUES ($1, $2, $3, $4, $5, $6)', [
			fullPost.title,
			fullPost.author,
			fullPost.created,
			fullPost.modified,
			fullPost.tags,
			fullPost.body,
		]));
	}

	// Add ten min blog posts.
	for (let i = 0; i < 25; i++) {
		promises.push(db.database.any('INSERT INTO blogPosts (title, author, created) VALUES ($1, $2, $3)', [
			minPost.title,
			minPost.author,
			minPost.created,
		]));
	}

	await Promise.all(promises);
}

export default populateDB;
