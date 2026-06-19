import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { UserModel, findUserByEmail, comparePasswords } from '../models/user.model';
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
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    });

    logger.info(`Login successful: JWT generated for ${user.email} with role [${user.role}]`);

    sendSuccess(res, {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle POST /api/v1/auth/register requests
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, teamId } = req.body;

    logger.info(`Processing registration attempt for user: ${email} with role [${role}]`);

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: Email ${email} is already registered.`);
      throw new AppError('Email address is already in use.', 400, 'BAD_REQUEST');
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create user
    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      teamId: teamId || null,
    });

    logger.info(`Registration successful: User ${newUser.email} created.`);

    sendSuccess(res, {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        teamId: newUser.teamId,
      }
    }, 201);
  } catch (error) {
    next(error);
  }
};
