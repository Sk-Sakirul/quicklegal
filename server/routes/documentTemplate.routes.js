const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const authenticate = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");
const {
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/documentTemplate.controller");

// Admin routes
router.post(
  "/upload",
  authenticate,
  roleMiddleware("admin"),
  upload.single("template"),
  createTemplate
);

router.put("/:id", authenticate, roleMiddleware("admin"), updateTemplate);

router.delete("/:id", authenticate, roleMiddleware("admin"), deleteTemplate);

// Anyone logged in can view templates
router.get("/", authenticate, getTemplates);

module.exports = router;