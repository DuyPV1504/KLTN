const axios = require('axios');
const History = require('../models/History');

/**
 * Generate IELTS reading practice questions
 * @route POST /api/practice/generate
 * @access Private
 */
const generateQuestions = async (req, res) => {
  try {
    const { text, questionType, num_questions } = req.body;

    // Gọi inference service để sinh câu hỏi
    const statementsResponse = await axios.post(
      `${process.env.PYTHON_INFERENCE_URL}/generate_questions`,
      {
        passage: text,
        num_questions: num_questions || 6,
        questionType: questionType
      }
    );
    
    const statements = statementsResponse.data.statements;
    
    // Gọi endpoint evaluate_answers để lấy đáp án và giải thích
    const evaluateResponse = await axios.post(
      `${process.env.PYTHON_INFERENCE_URL}/evaluate_answers`,
      {
        passage: text,
        statements: statements,
        questionType: questionType
      }
    );
    
    const results = evaluateResponse.data.results;
    
    // Định dạng lại kết quả để phù hợp với frontend
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
    const { passage, practiceType, score, questions } = req.body;
    // Use req.user from the auth middleware
    const userId = req.user.id;
    
    if (!passage || !practiceType || score === undefined || !questions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create new history entry
    const newHistory = new History({
      user: userId,
      passage,
      practiceType,
      score,
      questions,
      date: new Date()
    });
    
    await newHistory.save();
    
    return res.json({ 
      success: true, 
      historyId: newHistory._id,
      message: 'Practice results saved successfully' 
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