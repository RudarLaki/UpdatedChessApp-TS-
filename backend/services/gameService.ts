import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ChessGame } from "../models/ChessGame";
import { ddb } from "./awsService";
import { userService } from "./userService";
const GAME_TABLE = "Game";

class GameService {
  startGame = async (
    whitePlayerId: string,
    blackPlayerId: string,
    roomId: string,
    timeControl: { initial: number; increment: number }
  ) => {
    const whitePlayer = await userService.getUserById(whitePlayerId);

    const blackPlayer = await userService.getUserById(blackPlayerId);

    const gameId = crypto.randomUUID();
    const object: ChessGame = {
      gameId: crypto.randomUUID(),
      whitePlayerId,
      blackPlayerId,
      whitePlayerUsername: whitePlayer?.userName,
      blackPlayerUsername: blackPlayer?.userName,
      whitePlayerRating: whitePlayer?.elo,
      blackPlayerRating: blackPlayer?.elo,
      resultReason: null,
      roomId,
      sentAt: new Date().toISOString(),
      finishedAt: "",
      winner: null,
      chatId: null,
      moves: [], // e.g., ["e4", "e5", "Nf3", ...] in PGN or SAN notation
      status: "active",
      turn: "White", // who should play next
      timeControl,
    };
    await ddb.send(
      new PutCommand({
        TableName: GAME_TABLE,
        Item: object,
      })
    );
  };
  makeMove = async (req: Request, res: Response) => {};
}

export const gameService = new GameService();
