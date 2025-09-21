const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");
const Advocate = require("../models/advocate.model");
const mongoose = require("mongoose");

let userToken;
let userId;

beforeAll(async () => {
  // Create a test user to associate with advocate
  const user = await User.create({
    name: "Test Advocate",
    email: "advocate@test.com",
    password: "Password123",
    role: "advocate",
  });
  userId = user._id;

  // Mock login to get token
  const res = await request(app).post("/api/auth/login").send({
    email: "advocate@test.com",
    password: "Password123",
  });

  userToken = res.body.token;
});

afterEach(async () => {
  await Advocate.deleteMany({});
});

describe("Advocate API", () => {
  it("should create a new advocate profile", async () => {
    const res = await request(app)
      .post("/api/advocates")
      .set("Cookie", [`token=${userToken}`])
      .send({
        specialization: "Criminal Law",
        experience: 4,
        hourlyRate: 200,
        availability: [
          {
            date: new Date("2025-09-22"),
            slots: ["11:00-12:00", "01:00-02:00"],
          },
        ],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.advocate.specialization).toBe("Criminal Law");
    expect(res.body.advocate.availability.length).toBe(1);
    expect(res.body.advocate.availability[0].slots).toContain("11:00-12:00");
  });

  it("should get all advocates", async () => {
    await Advocate.create({
      user: userId,
      specialization: "Civil Law",
      experience: 3,
      hourlyRate: 150,
      availability: [{ date: new Date("2025-09-23"), slots: ["10:00-11:00"] }],
    });

    const res = await request(app).get("/api/advocates");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.advocates.length).toBe(1);
    expect(res.body.advocates[0].specialization).toBe("Civil Law");
  });

  it("should get a single advocate by ID", async () => {
    const advocate = await Advocate.create({
      user: userId,
      specialization: "Family Law",
      experience: 7,
      hourlyRate: 300,
      availability: [{ date: new Date("2025-09-24"), slots: ["09:00-10:00"] }],
    });

    const res = await request(app).get(`/api/advocates/${advocate._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.advocate.specialization).toBe("Family Law");
    expect(res.body.advocate.availability[0].slots).toContain("09:00-10:00");
  });
});
