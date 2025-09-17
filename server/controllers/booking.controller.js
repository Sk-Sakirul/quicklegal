const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");

// Create booking
const createBooking = async (req, res, next) => {
  try {
    const { advocateId, date, slot } = req.body;
    const userId = req.user._id || req.user.id;

    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      res.status(404);
      return next(new Error("Advocate not found"));
    }

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

    const booking = await Booking.create({
      user: userId,
      advocate: advocateId,
      date,
      slot,
    });

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
const getMyBookings = async (req, res, next) => {
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

// Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findById(req.params.id);
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

module.exports = { createBooking, getMyBookings, cancelBooking };
