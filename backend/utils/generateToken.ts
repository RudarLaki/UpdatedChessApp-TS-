import jwt from "jsonwebtoken";

export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
};
