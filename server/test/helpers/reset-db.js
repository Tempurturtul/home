import db from '../../db';

async function resetDB() {
	await db.database.any('DROP TABLE blogPosts');
	await db.database.any('DROP TABLE users');
	await db.database.any(`CREATE TABLE blogPosts (
		id SERIAL PRIMARY KEY,
		title VARCHAR NOT NULL,
		author VARCHAR NOT NULL,
		created TIMESTAMP NOT NULL,
		modified TIMESTAMP,
		tags VARCHAR[],
		body VARCHAR
	)`);
	await db.database.any(`CREATE TABLE users (
		name VARCHAR PRIMARY KEY,
		password VARCHAR NOT NULL,
		admin BOOLEAN
	)`);
}

export default resetDB;
