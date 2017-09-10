import crypto from 'crypto';
import db from '../../db';
import hashPassword from '../../helpers/hash-password';

async function createUser(app, role) {
	// User with random name and password.
	const user = {
		name: crypto.randomBytes(16).toString('hex'),
		password: crypto.randomBytes(16).toString('hex'),
		role,
	};

	// Salt and iterations for use when storing password.
	const salt = 'somesaltplease';
	const iterations = 1000;

	// Manually insert the user.
	await db.database.one('INSERT INTO users (name, password.hash, password.salt, password.iterations, role) VALUES ($1, $2, $3, $4, $5) RETURNING name', [
		user.name,
		hashPassword(user.password, salt, iterations),
		salt,
		iterations,
		user.role,
	]);

	// Return the user.
	return user;
}

export default createUser;
