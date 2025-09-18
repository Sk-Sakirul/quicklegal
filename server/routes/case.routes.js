const express = require('express');
const { createCase, getMyCases } = require('../controllers/case.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/create", authenticate, createCase);
router.get("/my", authenticate, getMyCases);

module.exports = router;