// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const router = require('express').Router();
const db = require('../db');
const verifyJWT = require('../helpers/middleware/verify-jwt');

router.post('/authenticate', db.authenticate);
router.post('/users', db.createUser);
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// Route middleware to require and verify tokens.
router.use(verifyJWT);

router.get('/users', db.getUsers);
router.get('/users/:name', db.getUserByName);
router.put('/users/:name', db.updateUser);
router.post('/blog-posts', db.createBlogPost);
router.put('/blog-posts/:id', db.updateBlogPost);
router.delete('/blog-posts/:id', db.deleteBlogPost);

module.exports = router;
