import test from 'ava';
import validUserPassword from '../helpers/valid-user-password';

test('validates user passwords', (t) => {
	const validPasswords = [
		'Pattycakes',
		'password',
		'piece of cake',
		'EXx__trem,45w354 04364gsz/>    DFGH-*/4235+',
		'onlysmall',
	];

	const invalidPasswords = [
		'.',
		'a',
		'1',
		' pieceofcake',
		'pieceofcake ',
	];

	t.plan(validPasswords.length + invalidPasswords.length);

	validPasswords.forEach((password) => {
		t.true(validUserPassword(password));
	});

	invalidPasswords.forEach((password) => {
		t.false(validUserPassword(password));
	});
});
