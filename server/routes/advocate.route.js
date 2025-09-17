const express = require("express");
const { getAdvocates, getAdvocateById, createAdvocate } = require("../controllers/advocate.controller");
const authenticate = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = express.Router();

router.get('/', getAdvocates);
router.get('/:id', getAdvocateById);
router.post('/', authenticate, roleMiddleware("advocate"), createAdvocate);

module.exports = router;