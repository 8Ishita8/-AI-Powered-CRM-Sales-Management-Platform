import bcrypt from 'bcrypt';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'executive';
  teamId?: string;
  createdAt: Date;
}

// In-memory mock database seeded with standard roles
const mockUsers: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Jane Doe (Admin)',
    email: 'admin@crm.com',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'John Smith (Manager)',
    email: 'manager@crm.com',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'manager',
    createdAt: new Date(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Bob Johnson (Executive)',
    email: 'executive@crm.com',
    passwordHash: bcrypt.hashSync('Password123', 10),
    role: 'executive',
    createdAt: new Date(),
  },
];

/**
 * Searches the user store for a user matching the given email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user || null;
};

/**
 * Compares a plaintext password against the saved bcrypt hash
 */
export const comparePasswords = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
