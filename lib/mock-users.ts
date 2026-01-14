import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Hashed password
  createdAt: Date;
}

// In-memory user storage (temporary - will be replaced with database)
const users: User[] = [];

/**
 * Get all users (for debugging)
 */
export function getAllUsers(): User[] {
  return users;
}

/**
 * Clear all users (for testing)
 */
export function clearAllUsers(): void {
  users.length = 0;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  // Check if user already exists
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(user);
  return user;
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by ID
 */
export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/**
 * Verify password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
