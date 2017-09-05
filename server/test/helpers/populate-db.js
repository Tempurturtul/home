import db from '../../db';
import testData from './test-data.json';
import hashPassword from '../../helpers/hash-password';

async function populateDB() {
	const admin = testData.users.admin;
	const user = testData.users.normal;
	const fullPost = testData.blogPosts.full;
	const minPost = testData.blogPosts.minimum;

	const promises = [];

	const salt = 'thisissalt';
	const iterations = 1000;

	// Add one admin user.
	await db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
		admin.name,
		hashPassword(admin.password, salt, iterations),
		salt,
		iterations,
		true,
	]);

	// Add one typical user.
	await db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
		user.name,
		hashPassword(user.password, salt, iterations),
		salt,
		iterations,
		false,
	]);

	// Add multiple admin users.
	for (let i = 0; i < 25; i++) {
		promises.push(db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
			`${admin.name} ${i}`,
			hashPassword(`${admin.password} ${i}`, salt, iterations),
			salt,
			iterations,
			true,
		]));
	}

	// Add multiple typical users.
	for (let i = 0; i < 25; i++) {
		promises.push(db.database.any('INSERT INTO users (name, password.hash, password.salt, password.iterations, admin) VALUES ($1, $2, $3, $4, $5)', [
			`${user.name} ${i}`,
			hashPassword(`${user.password} ${i}`, salt, iterations),
			salt,
			iterations,
			false,
		]));
	}

	// Add multiple full blog posts.
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

	// Add multiple min blog posts.
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
