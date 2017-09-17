import test from 'ava';
import pw from '../src/lib/password';

test('gets password hash iterations', (t) => {
	const iterations = pw.getIterations();

	t.true(Number.isSafeInteger(iterations));
});

test('gets random salt', (t) => {
	const a = pw.getSalt();
	const b = pw.getSalt();

	t.not(a, b);
});

test('calculates password hash', (t) => {
	const salt = pw.getSalt();
	const iterations = pw.getIterations();

	const password1 = 'I like cupcakes 100%';
	const password2 = 'I like cupcakes 110%';

	const hash1a = pw.calculateHash(password1, salt, iterations);
	const hash1b = pw.calculateHash(password1, salt, iterations);

	const hash2a = pw.calculateHash(password2, salt, iterations);
	const hash2b = pw.calculateHash(password2, salt, iterations);

	t.is(hash1a, hash1b);
	t.is(hash2a, hash2b);
	t.not(hash1a, hash2a);
});

test('parses raw password from DB', (t) => {
	const password = {
		hash: '43e9faf',
		salt: '9b310ac',
		iterations: 450,
	};

	const raw = `(${password.hash},${password.salt},${password.iterations})`;
	const parsed = pw.parseFromDB(raw);

	t.deepEqual(parsed, password);
});

test('identifies valid passwords', (t) => {
	const validPasswords = [
		'Pattycakes',
		'password',
		'piece of cake',
		'EXx__trem,45w354 04364gsz/>    DFGH-*/4235+',
		'onlysmall',
		(new Array(256 + 1)).join('a'),
	];

	const invalidPasswords = [
		'.',
		'a',
		'1',
		' pieceofcake',
		'pieceofcake ',
		(new Array(256 + 2)).join('a'),
	];

	t.plan(validPasswords.length + invalidPasswords.length);

	validPasswords.forEach((password) => {
		t.true(pw.valid(password));
	});

	invalidPasswords.forEach((password) => {
		t.false(pw.valid(password));
	});
});
