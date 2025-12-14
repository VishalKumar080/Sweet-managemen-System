import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  return sendError(res, statusCode, message, err.errors);
};

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error: CustomError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};