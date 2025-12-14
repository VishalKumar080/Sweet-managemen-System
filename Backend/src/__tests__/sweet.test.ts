import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import Sweet from "../models/Sweet";

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create regular user
  const userResponse = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "user@example.com",
    password: "password123",
  });
  userToken = userResponse.body.data.token;

  // Create admin user
  const adminResponse = await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  adminToken = adminResponse.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

describe("Sweet Management API Tests", () => {
  const validSweetData = {
    name: "Gulab Jamun",
    category: "Gulab Jamun",
    price: 250,
    quantity: 100,
    description: "Delicious sweet balls in sugar syrup",
  };

  describe("POST /api/sweets - Add Sweet", () => {
    it("should add a new sweet with valid data", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send(validSweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Sweet added successfully");
      expect(response.body.data.sweet.name).toBe(validSweetData.name);
      expect(response.body.data.sweet.price).toBe(validSweetData.price);
    });

    it("should fail without authentication", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .send(validSweetData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid category", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ ...validSweetData, category: "InvalidCategory" })
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/sweets - Get All Sweets", () => {
    beforeEach(async () => {
      await Sweet.create(validSweetData);
      await Sweet.create({
        name: "Rasgulla",
        category: "Rasgulla",
        price: 200,
        quantity: 50,
      });
    });

    it("should get all sweets with pagination", async () => {
      const response = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sweets.length).toBe(2);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.total).toBe(2);
    });

    it("should support pagination parameters", async () => {
      const response = await request(app)
        .get("/api/sweets?page=1&limit=1")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.sweets.length).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });

    it("should fail without authentication", async () => {
      await request(app).get("/api/sweets").expect(401);
    });
  });

  describe("GET /api/sweets/search - Search Sweets", () => {
    beforeEach(async () => {
      await Sweet.create(validSweetData);
      await Sweet.create({
        name: "Kaju Katli",
        category: "Kaju Katli",
        price: 500,
        quantity: 30,
      });
    });

    it("should search by name", async () => {
      const response = await request(app)
        .get("/api/sweets/search?name=Gulab")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.sweets.length).toBe(1);
      expect(response.body.data.sweets[0].name).toBe("Gulab Jamun");
    });

    it("should search by category", async () => {
      const response = await request(app)
        .get("/api/sweets/search?category=Kaju Katli")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.sweets.length).toBe(1);
      expect(response.body.data.sweets[0].category).toBe("Kaju Katli");
    });

    it("should search by price range", async () => {
      const response = await request(app)
        .get("/api/sweets/search?minPrice=200&maxPrice=300")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.sweets.length).toBe(1);
      expect(response.body.data.sweets[0].price).toBe(250);
    });

    it("should return empty array for no matches", async () => {
      const response = await request(app)
        .get("/api/sweets/search?name=NonExistent")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.sweets.length).toBe(0);
    });
  });

  describe("PUT /api/sweets/:id - Update Sweet", () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create(validSweetData);
      sweetId = sweet._id.toString();
    });

    it("should update sweet successfully", async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated Gulab Jamun", price: 300 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sweet.name).toBe("Updated Gulab Jamun");
      expect(response.body.data.sweet.price).toBe(300);
    });

    it("should fail with invalid sweet id", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Sweet not found");
    });
  });

  describe("DELETE /api/sweets/:id - Delete Sweet (Admin Only)", () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create(validSweetData);
      sweetId = sweet._id.toString();
    });

    it("should delete sweet as admin", async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Sweet deleted successfully");

      const deletedSweet = await Sweet.findById(sweetId);
      expect(deletedSweet).toBeNull();
    });

    it("should fail as regular user", async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Access denied. Admin only");
    });

    it("should fail with invalid id", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.message).toBe("Sweet not found");
    });
  });

  describe("POST /api/sweets/:id/purchase - Purchase Sweet", () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create(validSweetData);
      sweetId = sweet._id.toString();
    });

    it("should purchase sweet successfully", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sweet.quantity).toBe(90);
    });

    it("should fail with insufficient stock", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 150 })
        .expect(400);

      expect(response.body.message).toBe("Insufficient stock available");
    });

    it("should fail with invalid quantity", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body.message).toBe("Quantity must be greater than 0");
    });
  });

  describe("POST /api/sweets/:id/restock - Restock Sweet (Admin Only)", () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await Sweet.create(validSweetData);
      sweetId = sweet._id.toString();
    });

    it("should restock sweet as admin", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.sweet.quantity).toBe(150);
    });

    it("should fail as regular user", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);

      expect(response.body.message).toBe("Access denied. Admin only");
    });

    it("should fail with invalid quantity", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(response.body.message).toBe("Quantity must be greater than 0");
    });
  });
});
