import test from 'ava';
import validUserName from '../helpers/valid-user-name';

test('validates user names', (t) => {
	const validNames = [
		'Barry Boron',
		'Maximum Overdrive the 5th',
		'abc',
		'123',
	];

	const invalidNames = [
		'.',
		'a',
		'1',
		'_Barry Boron',
		'Barry  Boron',
		' Barry Boron',
		'Barry Boron ',
		'Barry*Boron',
		'Barry_Boron',
	];

	t.plan(validNames.length + invalidNames.length);

	validNames.forEach((name) => {
		t.true(validUserName(name));
	});

	invalidNames.forEach((name) => {
		t.false(validUserName(name));
	});
});
