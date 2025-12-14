import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";
import { generateToken } from "../utils/jwt";
import User from "../models/User";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 400, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  // Generate token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return sendSuccess(res, 201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return sendError(res, 400, "Please provide email and password");
  }

  // Find user with password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return sendError(res, 401, "Invalid credentials");
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return sendError(res, 401, "Invalid credentials");
  }

  // Generate token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return sendSuccess(res, 200, "Login successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
