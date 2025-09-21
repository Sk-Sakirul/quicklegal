const request = require("supertest");
const app = require("../index");
const User = require("../models/user.model");

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "John",
        email: "john@test.com",
        password: "Password123",
        role: "user",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Registration successful");
  });

  it("should login a user", async () => {
    await User.create({
      name: "Jane",
      email: "jane@test.com",
      password: "Password123",
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@test.com", password: "Password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
