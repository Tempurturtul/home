const router = require('express').Router();
const db = require('../db');

// Unprotected routes.
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// TODO User authentication.

// Protected routes.
router.post('/blog-posts', db.createBlogPost);

module.exports = router;
