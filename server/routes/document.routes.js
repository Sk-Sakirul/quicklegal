const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getTemplates,
  generateDocument,
  getUserDocuments
} = require("../controllers/document.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");
const router = express.Router();

// User routes
router.get("/", authenticate, getTemplates);
router.post("/generate", authenticate, generateDocument);
router.get("/user/:userId", authenticate, getUserDocuments);

module.exports = router;
