import { Response } from 'express';

export interface SuccessResponsePayload<T> {
  success: true;
  data: T;
  meta?: any;
}

export interface ErrorResponsePayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Sends a standardized success API response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: any
): Response => {
  const payload: SuccessResponsePayload<T> = {
    success: true,
    data,
  };
  if (meta !== undefined) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

/**
 * Sends a standardized error API response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_SERVER_ERROR',
  details?: any,
  stack?: string
): Response => {
  const payload: ErrorResponsePayload = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details !== undefined) {
    payload.error.details = details;
  }
  if (stack !== undefined && process.env.NODE_ENV !== 'production') {
    (payload.error as any).stack = stack;
  }
  return res.status(statusCode).json(payload);
};
