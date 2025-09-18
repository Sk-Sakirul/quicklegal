const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  createBooking,
  cancelBooking,
  getUserBookings,
  getBookingsForAdvocate,
  updateBookingStatus,
} = require("../controllers/booking.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");

const router = express.Router();

// user
router.post("/", authenticate, createBooking);
router.get("/user/my", authenticate, getUserBookings);
router.put("/:bookingId/cancel", authenticate, cancelBooking);  

// All Bookings of Advocate (Advocate)
router.get(
  "/advocate/:advocateId", 
  authenticate,
  roleMiddleware("advocate"),
  getBookingsForAdvocate
);

// Booking status update ( Advocate, admin )
router.patch(
  "/status-update/:bookingId", 
  authenticate,
  roleMiddleware("advocate", "admin"),
  updateBookingStatus
);

module.exports = router;