import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Protect routes - Check if user is authenticated
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, 401, "Not authorized, no token provided");
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      sendError(res, 401, "Not authorized, token missing");
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 401, "Not authorized, token invalid or expired");
  }
};

// Admin only access
export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendError(res, 401, "Not authorized");
    return;
  }

  if (req.user.role !== "admin") {
    sendError(res, 403, "Access denied. Admin only");
    return;
  }

  next();
};
