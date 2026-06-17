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
 * Custom operational errors
 */
export class AuthError extends AppError {
  constructor(message = 'Authentication failed. Please verify credentials.', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: Access is denied.', details?: any) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested resource was not found.', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed for request parameters.', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
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

  // Log error stack trace to server logs (always logged internally)
  logger.error(`Error processing request: ${req.method} ${req.originalUrl} - ${message}`, {
    stack: err.stack,
    code,
    details,
  });

  // Send standard JSON error response, conditionally exposing the stack trace based on NODE_ENV
  sendError(res, message, statusCode, code, details, err.stack);
};

export default errorHandlerMiddleware;
