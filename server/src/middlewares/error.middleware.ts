import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

/**
 * Reusable operational error class for HTTP exceptions
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Global Express error handling middleware
 */
export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = err instanceof AppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = err instanceof AppError ? err.details : undefined;

  // Logger will automatically capture the request ID using AsyncLocalStorage
  logger.error(`Error processing request: ${req.method} ${req.originalUrl} - ${message}`, {
    stack: err.stack,
    code,
    details,
  });

  sendError(res, message, statusCode, code, details);
};

export default errorHandlerMiddleware;
