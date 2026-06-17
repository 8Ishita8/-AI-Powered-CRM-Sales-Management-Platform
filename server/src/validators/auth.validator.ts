import { z } from 'zod';

/**
 * Validation schema for the POST /auth/login request body
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Invalid email address format'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  }),
});
