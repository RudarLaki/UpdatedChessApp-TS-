import { Alliance } from "../../../sharedGameLogic/boardLogic/Alliance";
import Board from "../../../sharedGameLogic/boardLogic/Board";
import PieceFactory from "../../../sharedGameLogic/pieceLogic/PieceFactory";

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

const API_URL = "http://localhost:3000/game/";

class GameService {
  startGame = async (
    whitePlayerId: string,
    blackPlayerId: string,
    userColor: string,
    roomId: string,
    timeControl: { matchTime: number; addition: number }
  ) => {
    const res = await fetch(API_URL + "start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whitePlayerId,
        blackPlayerId,
        userColor,
        roomId,
        timeControl,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed storing starting game");
    }

    return res.json();
  };

  requestGameState = async (roomId: string) => {
    try {
      const res = await fetch(`${API_URL}reconnect/${roomId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        let errorMsg = "Failed to fetch game state";
        try {
          const error = await res.json();
          errorMsg = error.message || errorMsg;
        } catch {
          // fallback if response isn't JSON
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      return data; // should be { board, moveHistory, players, ... }
    } catch (err) {
      console.error("Error in requestGameState:", err);
      throw err;
    }
  };

  createBoardFromDB = (gameState: GameState): Board => {
    const builder = new Board.Builder();

    // Place all pieces
    gameState.pieces.forEach((p: SerializedPiece) => {
      builder.setPiece(
        PieceFactory.create(p.piece, p.piecePosition, p.pieceAlliance)
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
