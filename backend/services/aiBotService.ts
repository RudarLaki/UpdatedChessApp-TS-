import crypto from "crypto";
import Board from "../../sharedGameLogic/boardLogic/Board";
import { GameState } from "../../sharedGameLogic/types/game";
import { ChessGame } from "../models/ChessGame";
import { gameService } from "./gameService";
import { userService } from "./userService";
import { ddb } from "./awsService";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { StockfishProcess } from "../chess-engines/StockfishProcess";
import path from "path";

const GAME_TABLE = "Game";

class AiBotService {
  private engines = new Map<string, StockfishProcess>();

  startGame = async (userId: string, level: number) => {
    const whitePlayer = await userService.getUserById(userId);

    const roomId = "bot-" + crypto.randomBytes(4).toString("base64url");

    const initialBoard = Board.createStandardBoard();
    const boardObject: GameState = gameService.getBoardForDB(initialBoard);

    const enginePath = path.join(
      process.cwd(),
      "chess-engines",
      "stockfish.exe"
    );
    let elo: number | undefined = undefined;

    // Use Elo only if >= 1320
    if (level >= 1320) {
      elo = level;
    } else {
      // Map levels <1320 to Stockfish skill levels 0–4
      if (level < 900) level = 0;
      else if (level < 1000) level = 1;
      else if (level < 1100) level = 2;
      else if (level < 1200) level = 3;
      else level = 4;
    }

    const engine = new StockfishProcess({
      enginePath: enginePath,
      threads: 2,
      hash: 256,
      skillLevel: elo ? undefined : level,
      elo,
    });

    await engine.ensureReady();
    console.log(engine);
    console.log(roomId);

    this.engines.set(roomId, engine);

    const object: ChessGame = {
      gameId: crypto.randomUUID(),
      whitePlayerId: userId,
      blackPlayerId: "bot",
      whitePlayerUsername: whitePlayer?.userName,
      blackPlayerUsername: "bot",
      whitePlayerRating: whitePlayer?.elo,
      blackPlayerRating: level,
      boardState: boardObject,
      moveHistory: [],
      resultReason: null,
      roomId,
      sentAt: new Date().toISOString(),
      finishedAt: "",
      winner: null,
      chatId: null,
      status: "active",
      turn: "White",
      timeControl: { initial: 0, increment: 0 },
    };
    await ddb.send(
      new PutCommand({
        TableName: GAME_TABLE,
        Item: object,
      })
    );
    return roomId;
  };
  makeMove = async (roomId: string, moves: string[]) => {
    const engine = this.engines.get(roomId);
    if (!engine) throw new Error("Engine not running for this game");

    await engine.setPosition({ moves });

    const bestMove = await engine.go({ movetime: 1000 });
    return bestMove;
  };

  close = (roomId: string) => {
    const engine = this.engines.get(roomId);
    if (engine) {
      engine.quit();
      this.engines.delete(roomId);
    }
  };

  reconnect = () => {};
}

export const aiBotService = new AiBotService();
