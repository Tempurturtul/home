import test from 'ava';
import validUserName from '../src/lib/valid-user-name';

test('identifies valid user names', (t) => {
	const validNames = [
		'Barry Boron',
		'Maximum Overdrive the 5th',
		'abc',
		'123',
		(new Array(32 + 1)).join('a'),
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
		(new Array(32 + 2)).join('a'),
	];

	t.plan(validNames.length + invalidNames.length);

	validNames.forEach((name) => {
		t.true(validUserName(name));
	});

	invalidNames.forEach((name) => {
		t.false(validUserName(name));
	});
});
