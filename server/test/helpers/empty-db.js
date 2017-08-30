import db from '../../db';

async function resetDB() {
	await db.database.any('DELETE FROM blogPosts *');
	await db.database.any('DELETE FROM users *');
}

export default resetDB;
