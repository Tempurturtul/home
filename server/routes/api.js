// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const router = require('express').Router();
const db = require('../db');
const verifyJWT = require('../helpers/middleware/verify-jwt');
const requireAdmin = require('../helpers/middleware/require-admin');

// Unprotected routes.
router.post('/authenticate', db.authenticate);
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// Route middleware to verify tokens.
router.use(verifyJWT);
// Route middleware to require admin.
router.use(requireAdmin);

// Admin-only routes.
router.post('/blog-posts', db.createBlogPost);

module.exports = router;
