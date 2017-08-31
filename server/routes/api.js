// Results are JSend-compliant JSON. (https://labs.omniti.com/labs/jsend)

const router = require('express').Router();
const db = require('../db');
const verifyJWT = require('../helpers/middleware/verify-jwt');
const verifyAdmin = require('../helpers/middleware/verify-admin');

// Unprotected routes.
router.post('/authenticate', db.authenticate);
router.get('/blog-posts', db.getBlogPosts);
router.get('/blog-posts/:id', db.getBlogPostById);

// Route middleware to verify tokens.
router.use(verifyJWT);
// Route middleware to verify admin.
router.use(verifyAdmin);

// Admin-only routes.
router.post('/blog-posts', db.createBlogPost);
router.put('/blog-posts/:id', db.updateBlogPost);
router.delete('/blog-posts/:id', db.deleteBlogPost);

module.exports = router;
