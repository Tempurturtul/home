// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const router = require('express').Router();
const db = require('../db');
const verifyJWT = require('../helpers/middleware/verify-jwt');

// Unprotected routes.
router.post('/login', db.authenticate);
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// Route middleware to verify tokens.
router.use(verifyJWT);

// Protected routes.
router.post('/blog-posts', db.createBlogPost);

module.exports = router;
