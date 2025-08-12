import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { ddb } from "../services/awsClient";
import { Request, Response } from "express";
import crypto from "crypto";

const USERS_TABLE = "Users";
const register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;
  try {
    const existing = await ddb.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "email-index",
        KeyConditionExpression: "email = :checkEmail",
        ExpressionAttributeValues: {
          ":checkEmail": email,
        },
      })
    );
    if (existing.Count !== 0)
      return res.status(400).json({ message: "user already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          id: crypto.randomUUID(),
          email,
          name,
          lastName,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          elo: 1200,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
      })
    );
    return res.status(201).json({
      message: "user succesfully registered",
      name,
      lastName,
      email,
      token: generateToken(email),
      userName: "",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existing = await ddb.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "email-index",
        KeyConditionExpression: "email = :checkEmail",
        ExpressionAttributeValues: {
          ":checkEmail": email,
        },
      })
    );
    if (!existing.Items)
      return res.status(401).json({ message: "user doesn't exist" });
    const user = existing.Items[0];
    const matchingPass = await bcrypt.compare(password, user.password);
    if (!matchingPass)
      return res.status(401).json({ message: "invalid password" });
    return res.status(201).json({
      message: "user logged in successfully",
      id: user.id,
      email: user.email,
      userName: user.userName,
      token: generateToken(email),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { register, login };
