const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Route for file upload
router.post('/upload', fileController.uploadFile);

module.exports = router;
