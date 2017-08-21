// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const pgp = require('pg-promise')();
const config = require('../config');

const db = pgp(config.database);
// JSend status messages.
const status = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
};

module.exports = {
  getBlogPosts(req, res) {
    db.any('select * from blogPosts ORDER BY created')
      .then((data) => {
        res.json({
          status: status.SUCCESS,
          data,
        });
      })
      .catch((err) => {
        res.json({
          status: status.ERROR,
          message: 'Error retrieving blog posts.',
          data: err,
        });
      });
  },
  getBlogPostById(req, res) {
    const id = req.params.id;

    if (id !== 0 && !id) {
      res.json({
        status: status.FAIL,
        data: {
          id: 'An id is required.',
        },
      });
    } else {
      db.one('select * from blogPosts where id=$1', [id])
        .then((data) => {
          res.json({
            status: status.SUCCESS,
            data,
          });
        })
        .catch((err) => {
          res.json({
            status: status.ERROR,
            message: 'Error retrieving blog post.',
            data: err,
          });
        });
    }
  },
  createBlogPost(req, res) {
    const { title, author, created, modified, tags, body } = req.body;

    if (!title || !author || !created) {
      const data = {};

      if (!title) {
        data.title = 'A title is required.';
      }
      if (!author) {
        data.author = 'An author is required.';
      }
      if (!created) {
        data.created = 'A created timestamp is required.';
      }

      req.json({
        status: status.FAIL,
        data,
      });
    } else {
      const queryStr = 'INSERT INTO ' +
        'blogPosts(title, author, created, modified, tags, body) ' +
        'VALUES($1, $2, $3, $4, $5, $6) ' +
        'RETURNING id';

      db.one(queryStr, [title, author, created, modified, tags, body])
        .then((data) => {
          res.json({
            status: status.SUCCESS,
            data,
          });
        })
        .catch((err) => {
          res.json({
            status: status.ERROR,
            message: 'Error creating blog post.',
            data: err,
          });
        });
    }
  },
};
