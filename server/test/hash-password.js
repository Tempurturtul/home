import test from 'ava';
import hashPassword from '../helpers/hash-password';

test('hashes a password', (t) => {
	const salt = 'this is salt';
	const iterations = 10000;
	const outputBytes = 32;

	const password1 = 'I like cupcakes 100%';
	const password2 = 'I like cupcakes 110%';

	const hash1a = hashPassword(password1, salt, iterations, outputBytes);
	const hash1b = hashPassword(password1, salt, iterations, outputBytes);

	const hash2a = hashPassword(password2, salt, iterations, outputBytes);
	const hash2b = hashPassword(password2, salt, iterations, outputBytes);

	t.is(hash1a, hash1b);
	t.is(hash2a, hash2b);
	t.not(hash1a, hash2a);

	// Hash length is 64 because hash is in hex and there are 4 bits per hex digit.
	t.is(hash1a.length, 64);
	t.is(hash2a.length, 64);
});
