import { Response } from "express";

interface SuccessResponse {
  success: true;
  message?: string;
  data?: any;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export const sendSuccess = (
  res: Response,
  statusCode: number = 200,
  message?: string,
  data?: any
): Response<SuccessResponse> => {
  const response: SuccessResponse = {
    success: true,
  };

  if (message) response.message = message;
  if (data) response.data = data;

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string = "Internal Server Error",
  errors?: any
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};
