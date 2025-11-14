import bcrypt from "bcrypt";

/**
 * Password Utility Module
 * 
 * Provides secure password hashing and comparison functions using bcrypt.
 * 
 * Security features:
 * - Uses bcrypt algorithm (industry standard)
 * - 10 salt rounds for strong protection against brute force
 * - Async operations to prevent blocking
 */

// Number of salt rounds for bcrypt hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

/**
 * Hash Password
 * 
 * Generates a secure hash of the provided password using bcrypt.
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to the hashed password string
 * 
 * The hash includes the salt, so each hash is unique even for identical passwords.
 */
export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify Password Match
 * 
 * Compares a plain text password with a hashed password to verify authenticity.
 * 
 * @param password - Plain text password to verify
 * @param hashedPassword - Previously hashed password from the database
 * @returns Promise resolving to true if passwords match, false otherwise
 * 
 * Security note:
 * This function is timing-safe and resistant to timing attacks.
 */
export const passwordMatches = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
