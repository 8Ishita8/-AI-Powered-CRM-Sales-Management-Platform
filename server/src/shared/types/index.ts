export type UserRole = 'admin' | 'manager' | 'executive';

export interface UserContext {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

import { UserTokenPayload } from '../../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}

