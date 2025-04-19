import * as crypto from "crypto";

/**
 * Generates a random token.
 * @returns A random token string.
 */
export default function generateToken(): string {
  return crypto.randomBytes(20).toString("hex");
}
