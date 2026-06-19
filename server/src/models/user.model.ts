import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'manager' | 'executive';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'manager', 'executive'],
    },
    teamId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>('User', UserSchema);

/**
 * Searches the user store for a user matching the given email
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email: email.toLowerCase() });
};

/**
 * Compares a plaintext password against the saved bcrypt hash
 */
export const comparePasswords = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

/**
 * Seeds the database with default users if they do not exist
 */
export const seedDefaultUsers = async (): Promise<void> => {
  try {
    const count = await UserModel.countDocuments();
    if (count > 0) {
      return; // Already seeded
    }

    const defaultUsers = [
      {
        name: 'Jane Doe (Admin)',
        email: 'admin@crm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'admin' as UserRole,
        teamId: 'team-alpha',
      },
      {
        name: 'John Smith (Manager)',
        email: 'manager@crm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'manager' as UserRole,
        teamId: 'team-alpha',
      },
      {
        name: 'Bob Johnson (Executive)',
        email: 'executive@crm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'executive' as UserRole,
        teamId: 'team-alpha',
      },
      // Frontend default emails compatibility
      {
        name: 'Anuja Sharma (Admin)',
        email: 'admin.sales@aicrm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'admin' as UserRole,
        teamId: 'team-alpha',
      },
      {
        name: 'Manager Alpha',
        email: 'manager.alpha@aicrm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'manager' as UserRole,
        teamId: 'team-alpha',
      },
      {
        name: 'Exec John',
        email: 'exec.john@aicrm.com',
        passwordHash: bcrypt.hashSync('Password123', 10),
        role: 'executive' as UserRole,
        teamId: 'team-alpha',
      },
    ];

    await UserModel.insertMany(defaultUsers);
    console.log('[Database Seed] Default users registered successfully.');
  } catch (error) {
    console.error('[Database Seed] Error seeding default users:', error);
  }
};
