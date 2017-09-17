const pgp = require('pg-promise')();
const database = require('../config').database;

const db = pgp(database);

module.exports = db;
