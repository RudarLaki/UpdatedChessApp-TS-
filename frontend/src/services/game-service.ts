import { Alliance } from "../../../sharedGameLogic/boardLogic/Alliance";
import Board from "../../../sharedGameLogic/boardLogic/Board";
import PieceFactory from "../../../sharedGameLogic/pieceLogic/PieceFactory";

import {
  type GameState,
  type SerializedPiece,
} from "../../../sharedGameLogic/types/game";
import api from "../context/apiJWT";

// const API_URL = "http://51.20.64.148:3000/game/";
const API_URL = "http://localhost:3000/game/";

class GameService {
  requestGameState = async (roomId: string) => {
    try {
      const res = await api.get(`${API_URL}reconnect/${roomId}`);
      return res.data;
    } catch (err) {
      console.error("Error in requestGameState:", err);
      throw err;
    }
  };

  createBoardFromDB = (gameState: GameState): Board => {
    const builder = new Board.Builder();

    gameState.pieces.forEach((p: SerializedPiece) => {
      builder.setPiece(
        PieceFactory.create(p.piece, p.piecePosition, p.pieceAlliance)
      );
    });

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
