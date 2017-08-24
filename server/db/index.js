// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const config = require('../config');

const db = pgp(config.database);
// JSend status messages.
const status = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
};

module.exports = {
  authenticate(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
      const data = {};

      if (!name) {
        data.name = 'A name is required.';
      }
      if (!password) {
        data.password = 'A password is required.';
      }

      res.json({
        status: status.FAIL,
        data,
      });
    } else {
      db.oneOrNone('SELECT * FROM users WHERE name=$1', [name])
        .then((data) => {
          if (!data) {
            res.json({
              status: status.FAIL,
              data: {
                name: 'No user with that name exists.',
              },
            });
          } else {
            const user = data;

            // Check password.
            if (user.password !== password) {
              res.json({
                status: status.FAIL,
                data: {
                  password: 'Wrong password.',
                },
              });
            } else {
              // Create a token.
              const token = jwt.sign(user, config.secret, {
                expiresIn: '10m',  // Expires in 10 minutes.
              });

              res.json({
                status: status.SUCCESS,
                data: token,
              });
            }
          }
        })
        .catch((err) => {
          res.json({
            status: status.ERROR,
            message: 'Error logging in.',
            data: err,
          });
        });
    }
  },
  getBlogPosts(req, res) {
    db.any('SELECT * FROM blogPosts ORDER BY created')
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
      db.one('SELECT * FROM blogPosts WHERE id=$1', [id])
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
