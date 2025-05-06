const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passage: {
    type: String,
    required: true
  },
  practiceType: {
    type: String,
    enum: ['TFNG', 'YNNG'],
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  questions: [
    {
      id: Number,
      text: String,
      correctAnswer: String,
      userAnswer: String,
      explanation: String
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);
