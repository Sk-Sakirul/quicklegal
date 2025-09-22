const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");
// const createPaymentIntent = require("../services/paymentService");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// Create booking with PaymentIntent
const createBookingWithPayment = async (req, res, next) => {
  try {
    const { advocateId, date, slot } = req.body;

    // Find advocate
    const advocate = await Advocate.findById(advocateId);
    if (!advocate) return res.status(404).json({ message: "Advocate not found" });

    // Check availability
    const availabilityForDate = advocate.availability.find(
      (a) => a.date.toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
    );
    if (!availabilityForDate)
      return res.status(400).json({ message: "Advocate not available on this date" });

    if (!availabilityForDate.slots.includes(slot))
      return res.status(400).json({ message: "Invalid slot for this advocate" });

    // Prevent double booking
    const existingBooking = await Booking.findOne({
      advocate: advocateId,
      date,
      slot,
      status: "confirmed",
    });
    if (existingBooking)
      return res.status(400).json({ message: "Slot already booked" });

    // Create Stripe PaymentIntent
    const amount = advocate.hourlyRate * 100; // in paise
    const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: "inr",
  payment_method_types: ["card"],
  description: `Legal consultation with ${advocate.user?.name || advocate.name} on ${date} at ${slot}`,
  // Required for Indian export transactions
  shipping: {
    name: req.user.name || "Customer Name",
    address: {
      line1: req.user.address?.line1 || "123 Main Street",
      city: req.user.address?.city || "Mumbai",
      state: req.user.address?.state || "MH",
      postal_code: req.user.address?.postal_code || "400001",
      country: "IN",
    },
  },
});

    // Save booking as pending
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
    });
  } catch (err) {
    next(err);
  }
};

// Confirm payment
const confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Prevent double confirmation
    const existingBooking = await Booking.findOne({
      advocate: booking.advocate,
      date: booking.date,
      slot: booking.slot,
      status: "confirmed",
    });
    if (existingBooking)
      return res.status(400).json({ message: "Slot already booked by someone else" });

    const cleanId = paymentIntentId.split("_secret")[0];
    if (cleanId !== booking.paymentIntentId)
      return res.status(400).json({ message: "Invalid payment reference" });

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Payment confirmed, booking successful", booking });
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
    // Find the advocate document for the logged-in user
    const advocate = await Advocate.findOne({ user: req.user._id });
    if (!advocate) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Fetch only bookings for this advocate
    const bookings = await Booking.find({ advocate: advocate._id })
      .populate("user", "name email")
      .populate("advocate", "specialization experience");

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};



module.exports = {
  createBookingWithPayment,
  getUserBookings,
  getBookingsForAdvocate,
  confirmPayment,
};
