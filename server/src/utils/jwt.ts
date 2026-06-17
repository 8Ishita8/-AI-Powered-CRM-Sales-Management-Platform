import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL CONFIG ERROR: JWT_SECRET environment variable is missing.');
  }
  return secret;
};

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'manager' | 'executive';
}

/**
 * Sign a new access token for a user session
 */
export const signAccessToken = (payload: UserTokenPayload): string => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRS_IN || process.env.JWT_EXPIRES_IN || '1h';
  
  const options: SignOptions = {
    expiresIn: expiresIn as any // Cast because compiler views process.env strings strictly
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verify a token and return the payload or throw an AppError
 */
export const verifyAccessToken = (token: string): UserTokenPayload => {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as UserTokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Authentication session has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
    }
    throw new AppError('Authentication session is invalid or has been modified.', 401, 'INVALID_TOKEN');
  }
};
