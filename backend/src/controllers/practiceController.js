const axios = require('axios');
const Passage = require('../models/Passage');
const Question = require('../models/Question');
const History = require('../models/History');


/**
 * Generate IELTS reading practice questions
 * @route POST /api/practice/generate
 * @access Private
 */
const generateQuestions = async (req, res) => {
  try {
    const { text, questionType, num_questions } = req.body;

    const statementsResponse = await axios.post(
      `${process.env.PYTHON_INFERENCE_URL}/generate_questions`,
      {
        passage: text,
        num_questions: num_questions || 6,
        questionType: questionType
      }
    );
    
    const statements = statementsResponse.data.statements;
    
    const evaluateResponse = await axios.post(
      `${process.env.PYTHON_INFERENCE_URL}/evaluate_answers`,
      {
        passage: text,
        statements: statements,
        questionType: questionType
      }
    );
    
    const results = evaluateResponse.data.results;
    
    const formattedQuestions = results.map((item, index) => ({
      id: index + 1,
      text: item.statement,
      correctAnswer: item.label,
      explanation: item.explanation
    }));

    res.json({ questions: formattedQuestions });
  } catch (err) {
    console.error("Error in generateQuestions:", err);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

/**
 * Save practice session results
 * @route POST /api/practice/save
 * @access Private
 */
const saveResults = async (req, res) => {
  try {
    const { passageContent, practiceType, score, questions, answers } = req.body;
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'You must be logged in to save results',
        notLoggedIn: true
      });
    }
    
    if (!passageContent || !practiceType || score === undefined || !questions || !answers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // 1. First save the passage
    const passage = new Passage({
      user: req.user.id,
      content: passageContent
    });
    await passage.save();
    
    // 2. Save all questions
    const savedQuestions = [];
    for (const q of questions) {
      const question = new Question({
        passage: passage._id,
        statement: q.text,
        label: q.correctAnswer,
        explanation: q.explanation
      });
      await question.save();
      savedQuestions.push({
        questionId: question._id,
        userAnswer: answers.find(a => a.id === q.id)?.answer || ""
      });
    }
    
    // 3. Save history directly
    const history = new History({
      user: req.user.id,
      passage: passage._id,
      practiceType,
      score,
      answers: savedQuestions
    });
    
    await history.save();
    return res.status(201).json({ 
      success: true, 
      historyId: history._id 
    });
    
  } catch (error) {
    console.error('Error saving practice results:', error);
    return res.status(500).json({ message: 'Failed to save practice results' });
  }
};

module.exports = {
  generateQuestions,
  saveResults
};