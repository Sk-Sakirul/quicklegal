const express = require("express");
const { getAdvocates, getAdvocateById, createOrUpdateAdvocate } = require("../controllers/advocate.controller");
const authenticate = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = express.Router();

// Get all advocates (user)
router.get('/', getAdvocates);
// Get single advocate profile (user)
router.get('/:advocateId', getAdvocateById);
// Create/update advocate profile(advocate)
router.post('/', authenticate, roleMiddleware("advocate"), createOrUpdateAdvocate);

module.exports = router;