"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        return (0, response_1.sendError)(res, 400, "User already exists with this email");
    }
    // Create user
    const user = await User_1.default.create({
        name,
        email,
        password,
        role: role || "user",
    });
    // Generate token
    const token = (0, jwt_1.generateToken)({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return (0, response_1.sendSuccess)(res, 201, "User registered successfully", {
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
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
        return (0, response_1.sendError)(res, 400, "Please provide email and password");
    }
    // Find user with password
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user) {
        return (0, response_1.sendError)(res, 401, "Invalid credentials");
    }
    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return (0, response_1.sendError)(res, 401, "Invalid credentials");
    }
    // Generate token
    const token = (0, jwt_1.generateToken)({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return (0, response_1.sendSuccess)(res, 200, "Login successful", {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
});
//# sourceMappingURL=authController.js.map