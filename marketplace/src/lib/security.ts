import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const TOKEN_BYTE_LENGTH = 48;
const TOKEN_TTL_DAYS = 7;
const OTP_CODE_LENGTH = 6;

const getSecret = () => {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || secret === "replace-with-64-char-secret") {
    throw new Error("AUTH_TOKEN_SECRET is not configured");
  }
  return secret;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateSessionToken = () => {
  return crypto.randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
};

export const hashSessionToken = (token: string) => {
  return crypto.createHmac("sha256", getSecret()).update(token).digest("hex");
};

export const generateOtpCode = (length: number = OTP_CODE_LENGTH) => {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

export const hashOtpCode = (code: string) => {
  return crypto.createHmac("sha256", getSecret()).update(code).digest("hex");
};

export const getExpiryDate = (days: number = TOKEN_TTL_DAYS) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
};

export const isExpired = (input: string | Date) => {
  const timestamp = input instanceof Date ? input.getTime() : new Date(input).getTime();
  return Number.isNaN(timestamp) ? true : timestamp < Date.now();
};
