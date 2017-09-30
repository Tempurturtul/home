const create = require('./create-blog-post');
const get = require('./get-blog-post');
const getAll = require('./get-blog-posts');
const update = require('./update-blog-post');
const remove = require('./delete-blog-post');

module.exports = {
	create,
	get,
	getAll,
	update,
	remove,
};
