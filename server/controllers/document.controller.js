const Document = require("../models/document.model");
const DocumentTemplate = require("../models/documentTemplate.model");
const { uploadEncryptedDocument } = require("../services/documentService");
const { decrypt } = require("../utils/encryption");
const axios = require("axios"); 

// 1. Fetch available templates
const getTemplates = async (req, res, next) => {
  try {
    const templates = await DocumentTemplate.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, templates });
  } catch (err) {
    next(err);
  }
};

// 2. Generate & upload encrypted document
const generateDocument = async (req, res, next) => {
  try {
    const { templateId, content } = req.body;
    const userId = req.user._id;

    const template = await DocumentTemplate.findById(templateId);
    if (!template || !content) {
      return res
        .status(404)
        .json({ success: false, message: "Template ID and content are required" });
    }

    const url = await uploadEncryptedDocument(content, `doc_${Date.now()}`);

    const doc = await Document.create({
      user: userId,
      template: templateId,
      fileUrl: url,
      encrypted: true,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

// 3. Retrieve all documents for a user (with decrypted content)
const getUserDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ user: req.params.userId }).populate("template");

    const results = [];

    for (const doc of docs) {
      const { data } = await axios.get(doc.fileUrl);

      const decryptedText = decrypt(data);

      results.push({
        ...doc.toObject(),
        decryptedContent: decryptedText, 
      });
    }

    res.json({ success: true, documents: results });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTemplates,
  generateDocument,
  getUserDocuments
};