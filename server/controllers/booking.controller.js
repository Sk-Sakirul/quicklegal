const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");
const createPaymentIntent = require("../services/paymentService");

// Create booking with payment intent
const createBookingWithPayment = async (req, res, next) => {
  try {
    const { advocateId, date, slot } = req.body;

    // Find advocate
    const advocate = await Advocate.findById(advocateId);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }

    // 🔹 Step 1: Check advocate availability for the given date
    const availabilityForDate = advocate.availability.find(
      (a) =>
        a.date.toISOString().split("T")[0] ===
        new Date(date).toISOString().split("T")[0]
    );

    if (!availabilityForDate) {
      return res
        .status(400)
        .json({ message: "Advocate not available on this date" });
    }

    // 🔹 Step 2: Validate if requested slot exists in advocate’s availability
    if (!availabilityForDate.slots.includes(slot)) {
      return res
        .status(400)
        .json({ message: "Invalid slot for this advocate" });
    }

    // 🔹 Step 3: Check if slot is already confirmed (block double booking)
    const existingBooking = await Booking.findOne({
      advocate: advocateId,
      date,
      slot,
      status: "confirmed",
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Create payment intent
    const amount = advocate.hourlyRate * 100;
    const paymentIntent = await createPaymentIntent(amount);

    // Save booking as "pending"
    const booking = await Booking.create({
      user: req.user._id,
      advocate: advocateId,
      date,
      slot,
      paymentIntentId: paymentIntent.id,
      paymentStatus: "unpaid",
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created, complete payment to confirm",
      bookingId: booking._id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId:
        process.env.NODE_ENV === "development" ? paymentIntent.id : undefined,
    });
  } catch (err) {
    next(err);
  }
};


// Confirm payment and finalize booking
const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify slot availability again (in case multiple pending at same time)
    const existingBooking = await Booking.findOne({
      advocate: booking.advocate,
      date: booking.date,
      slot: booking.slot,
      status: "confirmed",
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Slot already booked by someone else" });
    }

    const cleanId = paymentIntentId.split("_secret")[0];
    // Verify payment reference
    if (cleanId !== booking.paymentIntentId) {
      return res.status(400).json({ message: "Invalid payment reference" });
    }

    // Update booking as confirmed
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({
      message: "Payment confirmed, booking successful",
      booking,
    });
  } catch (err) {
    next(err);
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

// Get all bookings for an advocate by advocate id
const getBookingsForAdvocate = async (req, res, next) => {
  try {
    const advocateId = req.params.advocateId;

    // Ensure the logged-in user is the same advocate 
    const advocate = await Advocate.findOne({ user: req.user.id });
    if (!advocate || advocate._id.toString() !== advocateId) {
      res.status(403);
      return next(new Error("Not authorized to view these bookings"));
    }

    const bookings = await Booking.find({ advocate: advocateId })
      .populate("user", "name email") 
      .populate("advocate", "specialization experience");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookingWithPayment,
  getUserBookings,
  getBookingsForAdvocate,
  confirmPayment
};
