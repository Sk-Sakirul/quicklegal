const DocumentTemplate = require("../models/documentTemplate.model");
const cloudinary = require("../config/cloud");
const fs = require("fs");
const path = require("path");


// Create / Upload Template (Admin only)
const createTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const originalName = path.parse(req.file.originalname).name;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "document_templates",
      resource_type: "raw", 
      use_filename: true,
      unique_filename: false,
      public_id: `${originalName}_${Date.now()}.pdf`,
    });

    let fields = [];
    if (req.body.fields) {
      try {
        fields = JSON.parse(req.body.fields);
      } catch {
        fields = req.body.fields; 
      }
    }

    const template = await DocumentTemplate.create({
      name: req.body.name,
      description: req.body.description,
      fields,
      createdBy: req.user._id,
      fileUrl: result.secure_url,
      publicId: result.public_id, 
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get All Templates (Admin or User)
const getTemplates = async (req, res) => {
  try {
    const templates = await DocumentTemplate.find();
    res.status(200).json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Template (Admin only)
const updateTemplate = async (req, res) => {
  try {
    const template = await DocumentTemplate.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    // Update fields if provided
    template.name = req.body.name || template.name;
    template.description = req.body.description || template.description;
    template.fields = req.body.fields || template.fields;

    await template.save();
    res.status(200).json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Template (Admin only)
const deleteTemplate = async (req, res) => {
  try {
    const template = await DocumentTemplate.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    if (template.fileUrl) {
      const publicId = template.fileUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`document_templates/${publicId}`, {
        resource_type: "raw",
      });
    }

    await DocumentTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
};
