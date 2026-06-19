import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, UserTokenPayload } from '../utils/jwt';
import { AppError } from './error.middleware';
import logger from '../utils/logger';

/**
 * Authentication check middleware. Validates JWT and maps payload to req.user.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authentication failed: Missing or malformed Authorization header');
    throw new AppError('Authentication access token is missing or malformed.', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  
  // Verify token (throws AppError internally if expired or signature invalid)
  const payload = verifyAccessToken(token);
  req.user = payload;
  
  next();
};

/**
 * Enforces role restrictions. Succeeds if user has one of the allowed roles.
 */
export const requireRole = (allowedRoles: ('admin' | 'manager' | 'executive')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logger.warn('RBAC failed: User token payload is missing from request');
      throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`RBAC unauthorized: User ${req.user.email} (Role: ${req.user.role}) attempted to access restricted route`);
      throw new AppError('Forbidden: Insufficient privileges to access this resource.', 403, 'FORBIDDEN');
    }

    next();
  };
};

/**
 * Shortcut middleware restricting route to Managers and Admins
 */
export const requireManagerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  requireRole(['admin', 'manager'])(req, res, next);
};

/**
 * Validates resource ownership and scoping rules.
 * Throws 403 Forbidden if scoping rules are violated.
 * Scoping rules:
 * - Admin: Global access.
 * - Manager: Access allowed only within same team (resourceTeamId === req.user.teamId).
 * - Executive: Access allowed only if resource is assigned to them (resourceAssignedToId === req.user.userId).
 */
export const checkResourceAccess = (
  req: Request,
  resourceAssignedToId: string,
  resourceTeamId?: string
): void => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required.', 401, 'UNAUTHORIZED');
  }

  // 1. Admin bypasses all checks (Global access)
  if (user.role === 'admin') {
    return;
  }

  // 2. Manager checks: can act only on team resources
  if (user.role === 'manager') {
    if (!user.teamId || !resourceTeamId || user.teamId !== resourceTeamId) {
      logger.warn(`Scoping access denied: Manager ${user.email} (Team: ${user.teamId}) attempted to access team: ${resourceTeamId}`);
      throw new AppError('Forbidden: Access is restricted to resources within your own team.', 403, 'FORBIDDEN');
    }
    return;
  }

  // 3. Executive checks: can act only on assigned resources
  if (user.role === 'executive') {
    if (user.userId !== resourceAssignedToId) {
      logger.warn(`Scoping access denied: Executive ${user.email} (ID: ${user.userId}) attempted to access resource assigned to: ${resourceAssignedToId}`);
      throw new AppError('Forbidden: Access is restricted to resources assigned to you.', 403, 'FORBIDDEN');
    }
    return;
  }

  throw new AppError('Forbidden: Insufficient privileges.', 403, 'FORBIDDEN');
};
