import crypto from 'crypto';
import db from '../../src/db/db';
import pw from '../../src/lib/password';

async function createUser(role) {
	// User with random name and password.
	const user = {
		name: crypto.randomBytes(16).toString('hex'),
		password: crypto.randomBytes(16).toString('hex'),
		role,
	};

	// Salt and iterations for use when storing password.
	const salt = pw.getSalt();
	const iterations = pw.getIterations();

	// Manually insert the user.
	await db.one('INSERT INTO users (name, password.hash, password.salt, password.iterations, role) VALUES ($1, $2, $3, $4, $5) RETURNING name', [
		user.name,
		pw.calculateHash(user.password, salt, iterations),
		salt,
		iterations,
		user.role,
	]);

	// Return the user, including the raw password.
	return user;
}

export default createUser;
