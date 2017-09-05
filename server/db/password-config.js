const crypto = require('crypto');

const config = {
	// The number of password hash iterations to perform. (40,000 recommended as of August 2017.)
	iterations: 40000,
	// Get strong random salt. (16+ bytes recommended, 32 used.)
	getSalt() {
		return crypto.randomBytes(32).toString('hex');
	},
	// Number of bytes of output to take as the final password hash.
	outputBytes: 32,
};

module.exports = config;
