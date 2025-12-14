"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
// Protect routes - Check if user is authenticated
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            (0, response_1.sendError)(res, 401, "Not authorized, no token provided");
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            (0, response_1.sendError)(res, 401, "Not authorized, token missing");
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        (0, response_1.sendError)(res, 401, "Not authorized, token invalid or expired");
    }
};
exports.protect = protect;
// Admin only access
const adminOnly = (req, res, next) => {
    if (!req.user) {
        (0, response_1.sendError)(res, 401, "Not authorized");
        return;
    }
    if (req.user.role !== "admin") {
        (0, response_1.sendError)(res, 403, "Access denied. Admin only");
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=auth.js.map