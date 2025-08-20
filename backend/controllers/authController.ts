import { generateToken } from "../utils/generateToken";
import { Request, Response } from "express";
import { userService } from "../services/userService";
import {
  LoginRequest,
  RegisterRequest,
} from "../../sharedGameLogic/types/auth";

const USERS_TABLE = "Users";
const register = async (req: Request, res: Response) => {
  const { userName, email, password } = req.body as RegisterRequest;
  try {
    const user = await userService.checkUserExists(email);
    if (user != null)
      return res.status(400).json({ message: "user already exists" });

    await userService.registerUser(email, userName, password);
    return res.status(201).json({
      message: "user succesfully registered",
      userName,
      email,
      token: generateToken(email),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginRequest;
  try {
    const user = await userService.checkUserExists(email);
    if (!user) return res.status(401).json({ message: "user doesn't exist" });

    const matchingPass = await userService.loginUser(password, user);
    if (!matchingPass)
      return res.status(401).json({ message: "invalid password" });
    return res.status(201).json({
      message: "user logged in successfully",
      id: user.id,
      email: user.email,
      userName: user.userName,
      token: generateToken(email),
      elo: user.elo,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { register, login };
