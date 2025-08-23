import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SendMessageRequest } from "../../sharedGameLogic/types/game";
import { ddb } from "./awsService";
import { GameChat } from "../models/GameChat";

const CHAT_TABLE = "Chat";

class ChatService {
  sendMessage = async (sendMessageRequest: SendMessageRequest) => {
    const { userId, friendId, roomId, message, sentAt } = sendMessageRequest;

    try {
      // deterministic chatId between two users
      const id = [userId, friendId].sort().join("#");

      const object: GameChat = {
        id,
        messageId: crypto.randomUUID(),
        senderId: userId,
        receiverId: friendId,
        message,
        sentAt,
      };

      // PK = chatId, SK = sentAt
      await ddb.send(
        new PutCommand({
          TableName: CHAT_TABLE,
          Item: object,
        })
      );

      return object;
    } catch (err) {
      console.error("Error saving message", err);
      return err;
    }
  };

  // fetch all messages in a chat, sorted by sentAt
  getMessages = async (userId: string, friendId: string) => {
    const chatId = [userId, friendId].sort().join("#");

    const res = await ddb.send(
      new QueryCommand({
        TableName: CHAT_TABLE,
        KeyConditionExpression: "id = :chatId",
        ExpressionAttributeValues: {
          ":chatId": chatId,
        },
        ScanIndexForward: true, // ascending order by sentAt
      })
    );

    return res.Items as GameChat[];
  };
}

export const chatService = new ChatService();
