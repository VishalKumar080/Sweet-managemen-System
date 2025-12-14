import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/User";

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

describe("User Model Tests", () => {
  const validUserData = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  describe("User Creation", () => {
    it("should create a user successfully with valid data", async () => {
      const user = await User.create(validUserData);

      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
      expect(user.role).toBe("user");
      expect(user.password).not.toBe(validUserData.password);
    });

    it("should hash password before saving", async () => {
      const user = await User.create(validUserData);
      const userWithPassword = await User.findById(user._id).select(
        "+password"
      );

      expect(userWithPassword?.password).not.toBe(validUserData.password);
      expect(userWithPassword?.password.length).toBeGreaterThan(20);
    });

    it("should set default role as user", async () => {
      const user = await User.create(validUserData);
      expect(user.role).toBe("user");
    });

    it("should create admin user when role is specified", async () => {
      const adminUser = await User.create({
        ...validUserData,
        email: "admin@example.com",
        role: "admin",
      });

      expect(adminUser.role).toBe("admin");
    });
  });

  describe("User Validation", () => {
    it("should fail without name", async () => {
      const userWithoutName = { ...validUserData };
      delete (userWithoutName as any).name;

      await expect(User.create(userWithoutName)).rejects.toThrow();
    });

    it("should fail without email", async () => {
      const userWithoutEmail = { ...validUserData };
      delete (userWithoutEmail as any).email;

      await expect(User.create(userWithoutEmail)).rejects.toThrow();
    });

    it("should fail without password", async () => {
      const userWithoutPassword = { ...validUserData };
      delete (userWithoutPassword as any).password;

      await expect(User.create(userWithoutPassword)).rejects.toThrow();
    });

    it("should fail with invalid email format", async () => {
      const userWithInvalidEmail = {
        ...validUserData,
        email: "invalidemail",
      };

      await expect(User.create(userWithInvalidEmail)).rejects.toThrow();
    });

    it("should fail with duplicate email", async () => {
      await User.create(validUserData);

      await expect(
        User.create({ ...validUserData, name: "Another User" })
      ).rejects.toThrow();
    });

    it("should fail with short password", async () => {
      const userWithShortPassword = {
        ...validUserData,
        password: "12345",
      };

      await expect(User.create(userWithShortPassword)).rejects.toThrow();
    });
  });

  describe("Password Comparison", () => {
    it("should return true for correct password", async () => {
      const user = await User.create(validUserData);
      const userWithPassword = await User.findById(user._id).select(
        "+password"
      );

      const isMatch = await userWithPassword?.comparePassword("password123");
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const user = await User.create(validUserData);
      const userWithPassword = await User.findById(user._id).select(
        "+password"
      );

      const isMatch = await userWithPassword?.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });
  });
});
