"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode = 200, message, data) => {
    const response = {
        success: true,
    };
    if (message)
        response.message = message;
    if (data)
        response.data = data;
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode = 500, message = "Internal Server Error", errors) => {
    const response = {
        success: false,
        message,
    };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map