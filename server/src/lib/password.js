const crypto = require('crypto');

const pw = {
	getIterations() {
		return 40000;
	},

	getSalt() {
		return crypto.randomBytes(32).toString('hex');
	},

	calculateHash(password, salt, iterations) {
		return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
	},

	parseFromDB(data) {
		const p = data.slice(1, -1).split(',');
		return { hash: p[0], salt: p[1], iterations: Number(p[2]) };
	},

	valid(password) {
		// 8-256 characters.
		const validLength = password.length >= 8 && password.length <= 256;
		// No leading or trailing whitespace.
		const validEnds = /^[^\s].+[^\s]$/.test(password);

		return validLength && validEnds;
	},
};

module.exports = pw;
