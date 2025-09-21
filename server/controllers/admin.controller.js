const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");
const Case = require("../models/case.model");
const User = require("../models/user.model");


// Get booking statistics
const getBookingStats = async (req, res, next) => {
  try {
    const bookingsPerWeek = await Booking.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $lookup: {
          from: "advocates",
          localField: "advocate",
          foreignField: "_id",
          as: "advocateDetails",
        },
      },
      { $unwind: "$advocateDetails" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$advocateDetails.hourlyRate" },
        },
      },
    ]);

    res.json({ bookingsPerWeek, totalRevenue: revenue[0]?.totalRevenue || 0 });
  } catch (err) {
    next(err);
  }
};

// Get advocate activity
const getAdvocateStats = async (req, res, next) => {
  try {
    const advocateBookings = await Booking.aggregate([
      {
        $group: {
          _id: "$advocate",
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
        },
      },
      { $sort: { totalBookings: -1 } },
    ]);

    const advocates = await Advocate.find().select(
      "user specialization hourlyRate"
    );

    res.json({ advocateBookings, advocates });
  } catch (err) {
    next(err);
  }
};

// Get popular case types
const getPopularCases = async (req, res, next) => {
  try {
    const popularCases = await Case.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(popularCases);
  } catch (err) {
    next(err);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {getBookingStats, getAdvocateStats, getPopularCases, getAllUsers};