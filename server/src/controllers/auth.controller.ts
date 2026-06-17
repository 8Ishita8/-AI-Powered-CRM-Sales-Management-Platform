import { Request, Response, NextFunction } from 'express';
import { findUserByEmail, comparePasswords } from '../models/user.model';
import { signAccessToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';
import logger from '../utils/logger';

/**
 * Controller to handle POST /api/v1/auth/login requests
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    logger.info(`Processing login attempt for user: ${email}`);

    // 1. Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      logger.warn(`Login failed: Account with email ${email} does not exist.`);
      throw new AppError('Invalid email or password credential combination.', 401, 'UNAUTHORIZED');
    }

    // 2. Validate hashed password
    const isMatched = await comparePasswords(password, user.passwordHash);
    if (!isMatched) {
      logger.warn(`Login failed: Password mismatch for account ${email}.`);
      throw new AppError('Invalid email or password credential combination.', 401, 'UNAUTHORIZED');
    }

    // 3. Issue JWT access token
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    });

    logger.info(`Login successful: JWT generated for ${user.email} with role [${user.role}]`);

    sendSuccess(res, {
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};
