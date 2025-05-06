const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Use the existing auth middleware
const practiceController = require('../controllers/practiceController');

// Generate questions
router.post('/generate', auth, practiceController.generateQuestions);

// Save practice results
router.post('/save', auth, practiceController.saveResults);

module.exports = router;
