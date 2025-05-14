const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  passage:     { type: mongoose.Schema.Types.ObjectId, ref: "Passage", required: true },
  statement:   { type: String, required: true },
  label:       {
                 type: String,
                 enum: ["TRUE","FALSE","NOT GIVEN","YES","NO"],
                 required: true
               },
  explanation: { type: String, required: true }
}, {
  timestamps: true
});

QuestionSchema.index({ passage: 1 });

module.exports = mongoose.model("Question", QuestionSchema);
