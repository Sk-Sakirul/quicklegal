const crypto = require("crypto");
require("dotenv").config();

const ALGORITHM = "aes-256-cbc";

const SECRET_KEY = process.env.DOCUMENT_SECRET_KEY;

function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

// Decrypt back to buffer
function decrypt(hash) {
  const iv = Buffer.from(hash.iv, "hex");
  const encryptedText = Buffer.from(hash.content, "hex");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

module.exports = { encrypt, decrypt };