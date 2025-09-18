const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentTemplate" },
    fileUrl: { type: String, required: true }, // cloud file link
    encrypted: { type: Boolean, default: true },
    metadata: { type: Object }, // additional info like signedDate, parties involved
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema)
module.exports = Document;
