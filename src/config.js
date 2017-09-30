module.exports = {
	// Connection string for the PostgreSQL database.
	database: process.env.DATABASE_URL || 'postgres://postgres:foobar@localhost:5432/home',

	// Secret used to sign JSON Web Tokens.
	secret: 'thisisasillysecret',
};
