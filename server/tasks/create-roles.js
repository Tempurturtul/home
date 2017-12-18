const db = require('../src/db/db');
const roles = require('../src/lib/user-roles');

// For each role...
for (const r in roles) {
	// If the role doesn't exist, create it.
	db.oneOrNone('SELECT name FROM roles WHERE name = $1', [roles[r]])
		.then((role) => {
			// Add role if not found.
			if (!role) {
				db.one('INSERT INTO roles (name) VALUES ($1)', [roles[r]])
					.then(() => {
						console.log(`Role "${roles[r]}" created.`);
					});
			}
		});
}
