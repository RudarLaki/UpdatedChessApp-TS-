import { ddb } from "./awsService";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import bcrypt from "bcryptjs";
import { User } from "../models/User";

const USERS_TABLE = "Users";

class UserService {
  registerUser = async (email: string, userName: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await ddb.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          id: crypto.randomUUID(),
          email,
          userName,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          elo: 1200,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
        },
      })
    );
  };
  loginUser = async (password: string, user: User) => {
    const matchingPass = await bcrypt.compare(password, user.password);
    return matchingPass;
  };
  getUserById = async (id: string) => {
    const { Item } = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { id },
      })
    );
    return Item;
  };

  updateUser = async () => {};
  deleteUser = async () => {};
  checkUserExists = async (email: string) => {
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
    if (!existing || !existing.Items || existing.Items.length === 0)
      return null;
    const user = existing.Items[0] as User;
    return user;
  };
}

export const userService = new UserService();
