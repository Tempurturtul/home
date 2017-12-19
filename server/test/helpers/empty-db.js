import db from '../../src/db/db';

async function resetDB() {
	await db.any('DELETE FROM blog_posts_tags *');
	await db.any('DELETE FROM tags *');
	await db.any('DELETE FROM blog_posts *');
	await db.any('DELETE FROM users *');
	await db.any('DELETE FROM roles *');
}

export default resetDB;
