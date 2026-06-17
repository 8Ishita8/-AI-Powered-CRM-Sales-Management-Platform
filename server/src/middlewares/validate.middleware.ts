import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error.middleware';

/**
 * Express middleware to validate request payload against a Zod schema
 */
export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Map over issues to output human-readable paths
        const details = error.issues.map((issue) => ({
          field: issue.path.slice(1).join('.'), // Removes parent context ('body' or 'query')
          message: issue.message,
        }));
        next(new AppError('Request input validation failed', 400, 'VALIDATION_ERROR', details));
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
