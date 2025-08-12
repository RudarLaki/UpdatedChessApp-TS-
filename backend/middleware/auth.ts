// middleware/auth.ts
import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // For example, decode JWT
    const decoded = JSON.parse(atob(token)); // In real app, use jwt.verify
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
