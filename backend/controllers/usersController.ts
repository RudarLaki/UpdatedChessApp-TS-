import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../services/awsService";
import { Request, Response } from "express";
import { userService } from "../services/userService";

const USERS_TABLE_NAME = "Users";

const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existingUser = await ddb.send(
      new GetCommand({
        TableName: USERS_TABLE_NAME,
        Key: { id: id },
      })
    );
    const user = existingUser.Item;
    return res.status(201).json({ message: "success with getting user", user });
  } catch {
    return res.status(400).json({ message: "no user with that id" });
  }
};
const getFriends = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const friends = await userService.getFriends(id);
    return res.status(201).json({ message: "here your friends", friends });
  } catch {
    return res.status(500);
  }
};
const addFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  try {
    userService.addFriend(userId, friendId);
    return res.status(201).json({ message: "friends now" });
  } catch {
    return res.status(500);
  }
};
const search = async (req: Request, res: Response) => {
  const { query } = req.body;
  try {
    const list = await userService.search(query);
    return res.status(201).json({ message: "people to add", list });
  } catch {
    return res.status(500);
  }
};
export { getProfile, getFriends, addFriend, search };
