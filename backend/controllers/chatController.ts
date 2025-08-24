import { Request, Response } from "express";
import { chatService } from "../services/chatService";

const getMessages = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params;
  try {
    const messages = await chatService.getMessages(userId, friendId);
    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export { getMessages };
