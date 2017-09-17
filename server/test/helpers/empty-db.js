import db from '../../src/db/db';

async function resetDB() {
	await db.any('DELETE FROM blogPosts *');
	await db.any('DELETE FROM users *');
}

export default resetDB;
