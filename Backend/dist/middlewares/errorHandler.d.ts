import { Request, Response, NextFunction } from 'express';
export interface CustomError extends Error {
    statusCode?: number;
    errors?: any;
}
export declare const errorHandler: (err: CustomError, _req: Request, res: Response, _next: NextFunction) => Response;
export declare const notFound: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map