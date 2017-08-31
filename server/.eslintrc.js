// http://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: 'airbnb-base',
	rules: {
		'no-console': 'off',
		'no-tabs': 'off',
		'no-plusplus': 'off',
		'indent': ['error', 'tab'],
	},
};
