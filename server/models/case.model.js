const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String], 
    relatedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Case" }], 
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
