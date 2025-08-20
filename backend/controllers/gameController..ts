import { Request, Response } from "express";
import { ddb } from "../services/awsService";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import crypto from "crypto";
import { userService } from "../services/userService";
import { ChessGame } from "../models/ChessGame";
import { gameService } from "../services/gameService";

const GAME_TABLE = "Game";
const USERS_TABLE = "Users";

const endGame = async (req: Request, res: Response) => {};
const reconnect = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const exist = await ddb.send(
      new QueryCommand({
        TableName: "Game",
        IndexName: "roomId-index",
        KeyConditionExpression: "roomId = :roomId",
        ExpressionAttributeValues: {
          ":roomId": roomId,
        },
      })
    );
    if (!exist.Items || exist.Items.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    const game = exist.Items[0];
    const { boardState, moveHistory, whitePlayerId, blackPlayerId } = game;

    return res.status(200).json({
      boardState,
      moveHistory,
      whitePlayerId,
      blackPlayerId,
    });
  } catch (err) {
    console.error("Reconnect error:", err);
    return res.status(500).json({ message: "Failed to fetch game state" });
  }
};
export { endGame, reconnect };
