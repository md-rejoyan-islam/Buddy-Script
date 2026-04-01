import jwt, { type SignOptions } from "jsonwebtoken";
import secret from "../../config/secret";

const JWT_SECRET: jwt.Secret = secret.better_auth_secret;

export type TokenPayload = {
  userId: string;
  email: string;
  [key: string]: unknown;
};

/**
 * Create a signed JWT token
 */
export function createToken(
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * Returns the payload if valid, throws if invalid/expired
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

/**
 * Decode a JWT token without verification
 * Useful for reading claims from an expired token
 */
export function decodeToken(token: string): TokenPayload | null {
  const decoded = jwt.decode(token);
  return decoded as TokenPayload | null;
}
