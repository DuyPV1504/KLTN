const mongoose = require("mongoose");

const ChoiceSchema = new mongoose.Schema({
  history:    { type: mongoose.Schema.Types.ObjectId, ref: "History", required: true },
  question:   { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  userAnswer: {
                 type: String,
                 enum: ["TRUE","FALSE","NOT GIVEN","YES","NO"],
                 required: true
               }
}, {
  timestamps: true
});

ChoiceSchema.index({ history: 1, question: 1 }, { unique: true });

module.exports = mongoose.model("Choice", ChoiceSchema);
