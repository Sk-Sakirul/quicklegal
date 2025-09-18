const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloud");
const { encrypt } = require("../utils/encryption");

async function uploadEncryptedDocument(content, filename) {
  // Encrypt document content
  const encryptedData = encrypt(content);

  // Save locally first
  const filePath = path.join(__dirname, `../temp/${filename}.txt`);
  fs.writeFileSync(filePath, JSON.stringify(encryptedData));

  // Upload to cloud
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "legal_docs",
  });

  // Cleanup local file
  fs.unlinkSync(filePath);

  return result.secure_url;
}

module.exports = { uploadEncryptedDocument };