const mongoose = require("mongoose");

const documentTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    description: { type: String },
    fields: [{ label: String, type: String, required: Boolean }], // form fields for dynamic filling
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // admin/advocate
    fileUrl : {type: String, required: true}
  },
  { timestamps: true }
);

const DocumentTemplate = mongoose.model("DocumentTemplate", documentTemplateSchema);

module.exports = DocumentTemplate;