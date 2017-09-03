import db from '../../db';
import testData from './test-data.json';
import hashPassword from '../../helpers/hash-password';

async function populateDB() {
	const admin = testData.users.admin;
	const user = testData.users.normal;
	const fullPost = testData.blogPosts.full;
	const minPost = testData.blogPosts.minimum;

	const promises = [];

	const salt = 'this is salt';
	const iterations = 1000;

	await db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
		admin.name,
		hashPassword(admin.password, salt, iterations),
		salt,
		iterations,
		true,
	]);

	await db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
		user.name,
		hashPassword(user.password, salt, iterations),
		salt,
		iterations,
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
