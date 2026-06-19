import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from './error.middleware';

/**
 * Express middleware to validate request body against a Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect Zod error issues
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(new ValidationError('Request body validation failed', details));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Express middleware to validate request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Collect Zod error issues
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(new ValidationError('Request query parameters validation failed', details));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Express middleware to validate request parameters, query, and body simultaneously
 */
export const validateRequest = (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(new ValidationError('Request validation failed', details));
      } else {
        next(error);
      }
    }
  };
};

