import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import User from "../models/User";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Auth API Tests", () => {
  const validUserData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.user.name).toBe(validUserData.name);
      expect(response.body.data.user.role).toBe("user");
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should register an admin user when role is specified", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...validUserData, role: "admin" })
        .expect(201);

      expect(response.body.data.user.role).toBe("admin");
    });

    it("should fail if user already exists", async () => {
      await request(app).post("/api/auth/register").send(validUserData);

      const response = await request(app)
        .post("/api/auth/register")
        .send(validUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists with this email");
    });

    it("should fail without required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User" })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...validUserData, email: "invalidemail" })
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(validUserData);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUserData.email,
          password: validUserData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUserData.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should fail with non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should fail without email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please provide email and password");
    });

    it("should fail without password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: validUserData.email })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please provide email and password");
    });
  });
});
