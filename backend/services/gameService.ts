import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ChessGame } from "../models/ChessGame";
import { ddb } from "./awsService";
import { userService } from "./userService";
import Board from "../../sharedGameLogic/boardLogic/Board";
import Piece from "../../sharedGameLogic/pieceLogic/Piece";
import {
  MoveFactory,
  PawnPromotionMove,
} from "../../sharedGameLogic/boardLogic/moveLogic/Move";
import { MoveStatus } from "../../sharedGameLogic/boardLogic/moveLogic/MoveStatus";
import { Alliance } from "../../sharedGameLogic/boardLogic/Alliance";
import Pawn from "../../sharedGameLogic/pieceLogic/Pawn";
import Rook from "../../sharedGameLogic/pieceLogic/Rook";
import Knight from "../../sharedGameLogic/pieceLogic/Knight";
import Bishop from "../../sharedGameLogic/pieceLogic/Bishop";
import Queen from "../../sharedGameLogic/pieceLogic/Queen";
import King from "../../sharedGameLogic/pieceLogic/King";
import { number, string } from "zod";
const GAME_TABLE = "Game";

interface SerializedPiece {
  piece: string;
  pieceAlliance: "White" | "Black";
  piecePosition: number;
}

interface GameState {
  pieces: SerializedPiece[];
  turn: "White" | "Black";
  enPassant?: number | null;
  castlingRights: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
}

class GameService {
  startGame = async (
    whitePlayerId: string,
    blackPlayerId: string,
    roomId: string,
    timeControl: { initial: number; increment: number }
  ) => {
    const whitePlayer = await userService.getUserById(whitePlayerId);
    const blackPlayer = await userService.getUserById(blackPlayerId);

    const initialBoard = Board.createStandardBoard();
    const boardObject: GameState = this.getBoardForDB(initialBoard);

    const gameId = crypto.randomUUID();
    const object: ChessGame = {
      gameId: crypto.randomUUID(),
      whitePlayerId,
      blackPlayerId,
      whitePlayerUsername: whitePlayer?.userName,
      blackPlayerUsername: blackPlayer?.userName,
      whitePlayerRating: whitePlayer?.elo,
      blackPlayerRating: blackPlayer?.elo,
      boardState: boardObject,
      moveHistory: [],
      resultReason: null,
      roomId,
      sentAt: new Date().toISOString(),
      finishedAt: "",
      winner: null,
      chatId: null,
      // moves: [], // e.g., ["e4", "e5", "Nf3", ...] in PGN or SAN notation
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
  makeMove = async (
    roomId: string,
    moveCordinations: { from: number; to: number }
  ) => {
    const exist = await ddb.send(
      new QueryCommand({
        TableName: "Game",
        IndexName: "roomId-index", // must match the GSI name
        KeyConditionExpression: "roomId = :roomId",
        ExpressionAttributeValues: {
          ":roomId": roomId, // the roomId you want
        },
      })
    );
    if (!exist || !exist.Items) return false;

    const boardState: GameState = exist.Items[0].boardState;
    const gameId = exist.Items[0].gameId;
    const moveHistory = exist.Items[0].moveHistory;

    const gameBoard = this.createBoardFromDB(boardState);
    const move = MoveFactory.createMove(
      gameBoard,
      moveCordinations.from,
      moveCordinations.to
    );
    const transition = gameBoard.getCurrentPlayer().makeMove(move);

    if (move && transition.getMoveStatus() === MoveStatus.DONE) {
      let newBoard: Board;
      if (move instanceof PawnPromotionMove) {
        newBoard = transition.getBoard();
        //newBoard = handlePromotion(move, transition);
      } else {
        newBoard = transition.getBoard();
      }
      const updatedMoveHistory = [
        ...moveHistory,
        {
          from: moveCordinations.from,
          to: moveCordinations.to,
          notation: move.toString(),
        },
      ];

      // const onMove = newBoard.getCurrentPlayer().getAlliance().toString();
      // // Add 5 seconds to the player who just moved

      // if (newBoard.getCurrentPlayer().isCheckMate()) {
      //   //
      // }
      const newBoardState = this.getBoardForDB(newBoard);
      await ddb.send(
        new UpdateCommand({
          TableName: "Game",
          Key: { gameId: gameId }, // primary key of the item
          UpdateExpression:
            "SET #boardState = :boardState, #moveHistory = :moveHistory",
          ExpressionAttributeNames: {
            "#boardState": "boardState", // the attribute name
            "#moveHistory": "moveHistory",
          },
          ExpressionAttributeValues: {
            ":boardState": newBoardState, // new value
            ":moveHistory": updatedMoveHistory, // new value
          },
        })
      );
    }
  };

  // validMove = async (
  //   roomId: string,
  //   moveCordinations: { from: number; to: number }
  // ) => {};

  getBoardForDB = (boardState: Board): GameState => {
    const blackPiecesPosition = boardState
      .getBlackPieces()
      .map((piece: Piece) => ({
        piece: piece.toString(), // "Pawn", "King", etc.
        piecePosition: piece.getPiecePosition(),
        pieceAlliance: piece.getPieceAlliance().toString(),
      }));

    const whitePiecesPosition = boardState
      .getWhitePieces()
      .map((piece: Piece) => ({
        piece: piece.toString(),
        piecePosition: piece.getPiecePosition(),
        pieceAlliance: piece.getPieceAlliance().toString(),
      }));

    const pieces: SerializedPiece[] = [
      ...whitePiecesPosition,
      ...blackPiecesPosition,
    ];

    const turn: "White" | "Black" = boardState
      .getCurrentPlayer()
      .getAlliance()
      .toString();

    const enPassant: number | null =
      boardState.enPassantPawn?.getPiecePosition() ?? null;

    const castlingRights: {
      whiteKingSide: boolean;
      whiteQueenSide: boolean;
      blackKingSide: boolean;
      blackQueenSide: boolean;
    } = {
      whiteKingSide: boardState.whitePlayer.getKingCastleMove() != null,
      whiteQueenSide: boardState.whitePlayer.getQueenCastleMove() != null,
      blackKingSide: boardState.blackPlayer.getKingCastleMove() != null,
      blackQueenSide: boardState.blackPlayer.getQueenCastleMove() != null,
    };

    const object: GameState = {
      pieces,
      turn,
      enPassant,
      castlingRights,
    };

    return object;
  };
  pieceFactory = (
    piece: string,
    position: number,
    alliance: "White" | "Black"
  ) => {
    const color = alliance === "White" ? Alliance.WHITE : Alliance.BLACK;
    switch (piece) {
      case "P":
        return new Pawn(position, color);
      case "R":
        return new Rook(position, color);
      case "N":
        return new Knight(position, color);
      case "B":
        return new Bishop(position, color);
      case "Q":
        return new Queen(position, color);
      case "K":
        return new King(position, color);
      default:
        throw new Error(`Unknown piece type: ${piece}`);
    }
  };

  createBoardFromDB = (gameState: GameState): Board => {
    const builder = new Board.Builder();

    // Place all pieces
    gameState.pieces.forEach((p: SerializedPiece) => {
      builder.setPiece(
        this.pieceFactory(p.piece, p.piecePosition, p.pieceAlliance)
      );
    });

    // Set turn
    builder.setNextMoveMaker(
      gameState.turn === "White" ? Alliance.WHITE : Alliance.BLACK
    );

    // Castling rights
    // if (!gameState.castlingRights.whiteKingSide)
    //   builder.whitePlayer?.disableKingSideCastling?.();
    // if (!gameState.castlingRights.whiteQueenSide)
    //   builder.whitePlayer?.disableQueenSideCastling?.();
    // if (!gameState.castlingRights.blackKingSide)
    //   builder.blackPlayer?.disableKingSideCastling?.();
    // if (!gameState.castlingRights.blackQueenSide)
    //   builder.blackPlayer?.disableQueenSideCastling?.();

    return builder.build();
  };
}

export const gameService = new GameService();
