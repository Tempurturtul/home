const db = require('../src/db/db');
const pw = require('../src/lib/password');
const roles = require('../src/lib/user-roles');

if (process.argv.length !== 4) {
	throw new Error('Incorrect number of arguments.');
}

const user = {
	name: process.argv[2],
	password: process.argv[3],
	role: roles.ADMIN,
};

// Salt and iterations for use when storing password.
const salt = pw.getSalt();
const iterations = pw.getIterations();

// Manually insert the user.
db.one('INSERT INTO users (name, password.hash, password.salt, password.iterations, role) VALUES ($1, $2, $3, $4, $5) RETURNING name', [
	user.name,
	pw.calculateHash(user.password, salt, iterations),
	salt,
	iterations,
	user.role,
])
	.then(() => {
		console.log('Admin created.');
	});
