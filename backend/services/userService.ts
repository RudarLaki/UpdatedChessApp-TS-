import { ddb } from "./awsService";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Friends } from "../models/Friends";

const USERS_TABLE = "Users";
const FRIENDS_TABLE = "Friends";

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

  addFriend = async (userId1: string, userId2: string) => {
    //check if users even exist, and if they already friends?
    // Add friendship both ways
    const friendObject: Friends = {
      id: [userId1, userId2].sort().join("#"),
      userId1,
      userId2,
      status: "friends",
      sentAt: new Date().toISOString(),
    };
    await ddb.send(
      new PutCommand({
        TableName: FRIENDS_TABLE,
        Item: friendObject,
      })
    );
  };

  // Get all friends of a user
  getFriends = async (userId: string) => {
    const friends1Res = await ddb.send(
      new QueryCommand({
        TableName: FRIENDS_TABLE,
        IndexName: "userId1-index",
        KeyConditionExpression: "userId1 = :uid",
        ExpressionAttributeValues: { ":uid": userId },
      })
    );
    // Query friends where user is in userId2
    const friends2Res = await ddb.send(
      new QueryCommand({
        TableName: FRIENDS_TABLE,
        IndexName: "userId2-index",
        KeyConditionExpression: "userId2 = :uid",
        ExpressionAttributeValues: { ":uid": userId },
      })
    );

    const friends1 = friends1Res.Items ?? [];
    const friends2 = friends2Res.Items ?? [];

    return [...friends1, ...friends2];
  };

  search = async (query: string) => {
    // Option 1: if `userId` is a key or indexed (better performance)
    const res = await ddb.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        KeyConditionExpression: "begins_with(id, :q)",
        ExpressionAttributeValues: {
          ":q": query,
        },
      })
    );

    return res.Items ?? [];
  };
}

export const userService = new UserService();
