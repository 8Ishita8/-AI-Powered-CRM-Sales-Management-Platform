export type UserRole = "EXECUTIVE" | "MANAGER" | "ADMIN";

export interface UserContext {
  id: string;
  role: UserRole;
  teamId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}
