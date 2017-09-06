const crypto = require('crypto');

module.exports = {
	database: 'postgres://user:password@host:port/database',

	// The secret used to sign JSON Web Tokens.
	secret: 'a secret',

	// Password config updated August 2017.
	password: {
		// The number of password hash iterations to perform.
		iterations: 40000,
		// Get strong random salt.
		getSalt() {
			return crypto.randomBytes(32).toString('hex');
		},
		// Number of bytes of output to take as the final password hash.
		outputBytes: 32,
	},
};
