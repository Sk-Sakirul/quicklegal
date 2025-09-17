const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { createBooking, getMyBookings, cancelBooking } = require("../controllers/booking.controller");

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.put('/:id/cancel', authenticate, cancelBooking);

module.exports = router;