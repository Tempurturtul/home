import test from 'ava';
import parsePasswordFromDB from '../helpers/parse-password-from-db';

test('parses a password retrieved from the db', (t) => {
	const password = {
		hash: '43e9faf',
		salt: 'this is salt',
		iterations: 450,
	};

	const raw = `(${password.hash},"${password.salt}",${password.iterations})`;

	t.deepEqual(parsePasswordFromDB(raw), password);
});
