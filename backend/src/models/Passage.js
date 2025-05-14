const mongoose = require("mongoose");

const PassageSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

PassageSchema.index({ user: 1 });

module.exports = mongoose.model("Passage", PassageSchema);

