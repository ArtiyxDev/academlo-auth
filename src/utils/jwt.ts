import jwt from "jose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * JWT Utility Module
 *
 * Provides functions for generating and verifying JSON Web Tokens (JWT)
 * using the jose library for secure token-based authentication.
 *
 * Security features:
 * - Uses HS256 (HMAC with SHA-256) algorithm
 * - 5-minute token expiration for enhanced security
 * - Secret key validation on module load
 * - Automatic issued-at timestamp
 */

// Validate JWT_SECRET exists and is not empty
const JWT_SECRET_STRING = process.env.JWT_SECRET;

if (!JWT_SECRET_STRING || JWT_SECRET_STRING.trim() === "") {
  throw new Error(
    "❌ JWT_SECRET is not defined in environment variables. Please check your .env file."
  );
}

// Encode the secret key for use with jose library
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const ALGORITHM = "HS256";

/**
 * Generate JWT Token
 *
 * Creates a signed JWT token with the provided payload.
 *
 * @param payload - Object containing data to encode in the token (e.g., { id, email })
 * @returns Signed JWT token string
 *
 * Token includes:
 * - Custom payload data
 * - Issued at timestamp (iat)
 * - Expiration time (exp) - 5 minutes from issue
 */
export const generateJWT = async (payload: any) => {
  return await new jwt.SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(JWT_SECRET);
};

/**
 * Verify JWT Token
 *
 * Validates and decodes a JWT token, checking signature and expiration.
 *
 * @param token - JWT token string to verify
 * @returns Decoded payload if token is valid
 * @throws Error if token is invalid, expired, or signature verification fails
 */
export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwt.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.log("JWT verification failed:", error);
    throw new Error("Invalid token");
  }
};
