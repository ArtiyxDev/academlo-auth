import jwt from "jose";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_STRING = process.env.JWT_SECRET;

if (!JWT_SECRET_STRING || JWT_SECRET_STRING.trim() === "") {
  throw new Error(
    "❌ JWT_SECRET is not defined in environment variables. Please check your .env file."
  );
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const ALGORITHM = "HS256";

export const generateJWT = async (payload: any) => {
  return await new jwt.SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(JWT_SECRET);
};

export const verifyJWT = async (token: string) => {
  try {
    const { payload } = await jwt.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.log("JWT verification failed:", error);
    throw new Error("Invalid token");
  }
};
