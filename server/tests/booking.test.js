// tests/booking.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); 
const User = require("../models/user.model");
const Advocate = require("../models/advocate.model");
const Booking = require("../models/booking.model");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "testsecret");
};

describe("Booking API", () => {
  let user, advocate, userToken, advocateToken;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: "Password123",
      role: "user",
    });
    userToken = generateToken(user._id, user.role);

    const advUser = await User.create({
      name: "Advocate User",
      email: "advocate@test.com",
      password: "Password123",
      role: "advocate",
    });
    advocateToken = generateToken(advUser._id, advUser.role);

    advocate = await Advocate.create({
      user: advUser._id,
      specialization: "Criminal Law",
      experience: 4,
      hourlyRate: 200,
      availability: [
        {
          date: new Date("2025-09-22"),
          slots: ["11:00-12:00", "13:00-14:00"],
        },
      ],
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Advocate.deleteMany({});
    await Booking.deleteMany({});
  });

  it("should create a booking with payment intent", async () => {
    const res = await request(app)
      .post("/api/bookings/")
      .set("Cookie", [`token=${userToken}`])
      .send({
        advocateId: advocate._id,
        date: "2025-09-22",
        slot: "11:00-12:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("bookingId");
    expect(res.body).toHaveProperty("clientSecret");
  }, 50000);

  it("should confirm payment and finalize booking", async () => {
    const booking = await Booking.create({
      user: user._id,
      advocate: advocate._id,
      date: "2025-09-22",
      slot: "11:00-12:00",
      paymentIntentId: "pi_test123",
      paymentStatus: "unpaid",
      status: "pending",
    });

    const res = await request(app)
      .post("/api/bookings/confirm")
      .set("Cookie", [`token=${userToken}`])
      .send({
        bookingId: booking._id,
        paymentIntentId: "pi_test123_secret_abc",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.booking.paymentStatus).toBe("paid");
    expect(res.body.booking.status).toBe("confirmed");
  });

  it("should get user bookings", async () => {
    await Booking.create({
      user: user._id,
      advocate: advocate._id,
      date: "2025-09-22",
      slot: "11:00-12:00",
      paymentIntentId: "pi_test123",
      paymentStatus: "unpaid",
      status: "pending",
    });

    const res = await request(app)
      .get("/api/bookings/user/my")
      .set("Cookie", [`token=${userToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.bookings.length).toBe(1);
    expect(res.body.bookings[0].advocate.specialization).toBe("Criminal Law");
  });

  it("should get bookings for advocate", async () => {
    const booking = await Booking.create({
      user: user._id,
      advocate: advocate._id,
      date: "2025-09-22",
      slot: "11:00-12:00",
      paymentIntentId: "pi_test123",
      paymentStatus: "unpaid",
      status: "pending",
    });

    const res = await request(app)
      .get(`/api/bookings/advocate/${advocate._id}`)
      .set("Cookie", [`token=${advocateToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.bookings.length).toBe(1);
    expect(res.body.bookings[0].slot).toBe("11:00-12:00");
  });
});
