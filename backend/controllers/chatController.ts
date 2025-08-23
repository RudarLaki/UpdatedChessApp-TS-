import { Request, Response } from "express";
import { chatService } from "../services/chatService";

const getMessages = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params;
  const messages = await chatService.getMessages(userId, friendId);
  return res.status(201).json({ messages });
};

export { getMessages };
