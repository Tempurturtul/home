const create = require('./create-user');
const get = require('./get-user');
const getAll = require('./get-users');
const update = require('./update-user');
const remove = require('./delete-user');

module.exports = {
	create,
	get,
	getAll,
	update,
	remove,
};
