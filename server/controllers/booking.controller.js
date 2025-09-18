const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");

// Create booking with advocate (check availability)
const createBooking = async (req, res, next) => {
  try {
    const { advocateId, date, slot } = req.body;
    const userId = req.user._id || req.user.id;

    // Find advocate
    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      res.status(404);
      return next(new Error("Advocate not found"));
    }

    // Find availability entry for the given date
    const availabilityForDate = advocate.availability.find(
      (a) =>
        a.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!availabilityForDate) {
      res.status(400);
      return next(new Error("Advocate not available on this date"));
    }

    // Check if slot exists in that date’s availability
    if (!availabilityForDate.slots.includes(slot)) {
      res.status(400);
      return next(new Error("Advocate not available at this slot"));
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      advocate: advocateId,
      date,
      slot,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      res.status(400);
      return next(new Error("Slot already booked"));
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      advocate: advocateId,
      date,
      slot,
      status: "pending",
    });

    // Remove booked slot from advocate availability
    availabilityForDate.slots = availabilityForDate.slots.filter(
      (s) => s !== slot
    );

    // If no slots left for the day, remove the entire date entry
    if (availabilityForDate.slots.length === 0) {
      advocate.availability = advocate.availability.filter(
        (a) =>
          a.date.toISOString().split("T")[0] !==
          new Date(date).toISOString().split("T")[0]
      );
    }

    await advocate.save();

    res.status(201).json({
      success: true,
      message: "Successfully booked",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("advocate", "specialization hourlyRate")
      .populate("user", "name email");

    if (!bookings || bookings.length === 0) {
      res.status(404);
      return next(new Error("No booking found"));
    }

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Get all bookings for an advocate
const getBookingsForAdvocate = async (req, res, next) => {
  try {
    const advocateId = req.params.advocateId;

    // Ensure the logged-in user is the same advocate (extra safety)
    const advocate = await Advocate.findOne({ user: req.user.id });
    if (!advocate || advocate._id.toString() !== advocateId) {
      res.status(403);
      return next(new Error("Not authorized to view these bookings"));
    }

    const bookings = await Booking.find({ advocate: advocateId })
      .populate("user", "name email") // show user details
      .populate("advocate", "specialization experience");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (confirmed/cancelled)
const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const { status } = req.body; 

    if (!["confirmed", "cancelled"].includes(status)) {
      res.status(400);
      return next(new Error("Invalid status"));
    }

    const booking = await Booking.findById(bookingId).populate("advocate");
    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    // Check role: Advocate can only update their own bookings
    if (req.user.role === "advocate") {
      const advocate = await Advocate.findOne({ user: req.user.id });
      if (
        !advocate ||
        advocate._id.toString() !== booking.advocate._id.toString()
      ) {
        res.status(403);
        return next(new Error("Not authorized to update this booking"));
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking (user)
const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    if (booking.user.toString() !== userId.toString()) {
      res.status(403);
      return next(new Error("Not authorized to cancel this booking"));
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingsForAdvocate,
  updateBookingStatus,
  cancelBooking,
};
