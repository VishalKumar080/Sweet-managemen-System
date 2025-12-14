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
export declare const sendSuccess: (res: Response, statusCode?: number, message?: string, data?: any) => Response<SuccessResponse>;
export declare const sendError: (res: Response, statusCode?: number, message?: string, errors?: any) => Response<ErrorResponse>;
export {};
//# sourceMappingURL=response.d.ts.map