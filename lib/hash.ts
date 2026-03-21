import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashSecret(value: string, pepper?: string) {
  return sha256(`${value}:${pepper ?? ""}`);
}

export function randomToken(bytes = 24) {
  return randomBytes(bytes).toString("hex");
}

export function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;
  const derived = scryptSync(password, salt, 64).toString("hex");
  return safeCompare(derived, expected);
}
