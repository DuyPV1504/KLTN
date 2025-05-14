const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const practiceController = require('../controllers/practiceController');

router.post('/generate', practiceController.generateQuestions);

router.post('/save', auth, practiceController.saveResults);

module.exports = router;
