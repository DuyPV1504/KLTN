const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passage:      { type: mongoose.Schema.Types.ObjectId, ref: "Passage", required: true },
  practiceType: {
                  type: String,
                  enum: ["TFNG","YNNG"],
                  required: true
                },
  score:        { type: Number, required: true },
  answers: [{
    question:      { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    userAnswer:    {
                     type: String,
                     enum: ["TRUE","FALSE","NOT GIVEN","YES","NO"],
                     required: true
                   },
    correctAnswer: {
                     type: String,
                     enum: ["TRUE","FALSE","NOT GIVEN","YES","NO"],
                     required: true
                   },
    statement:     { type: String, required: true },
    explanation:   { type: String, required: true }
  }]
}, {
  timestamps: true
});

HistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("History", HistorySchema);
