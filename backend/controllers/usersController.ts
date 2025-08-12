import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../services/awsClient";
import { Request, Response } from "express";

const USERS_TABLE_NAME = "Users";

const getProfile = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingUser = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE_NAME,
        Key: { id: email },
      })
    );
    const user = existingUser.Item;
    return res.status(201).json({ message: "success with getting user", user });
  } catch {
    return res.status(400).json({ message: "no user with that email" });
  }
};

export { getProfile };
