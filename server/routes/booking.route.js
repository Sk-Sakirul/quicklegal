const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getUserBookings,
  getBookingsForAdvocate,
  createBookingWithPayment,
  confirmPayment,
} = require("../controllers/booking.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = express.Router();

// User
router.post("/", authenticate,roleMiddleware("user"), createBookingWithPayment);
router.post("/confirm", authenticate, confirmPayment); 
router.get("/user/my", authenticate, getUserBookings);

// Advocate's bookings by advocateId
router.get(
  "/advocate",
  authenticate,
  roleMiddleware("advocate"),
  getBookingsForAdvocate
);

module.exports = router;