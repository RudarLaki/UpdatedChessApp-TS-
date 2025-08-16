import { KingCastleMove } from "../moveLogic/Move";
import { QueenCastleMove } from "../moveLogic/Move";
import Rook from "../../pieceLogic/Rook";
import Player from "./Player";
import { Alliance, type AllianceType } from "../Alliance";
import type Board from "../Board";
import type { Move } from "../moveLogic/Move";
import type { List } from "immutable";
import type Piece from "../../pieceLogic/Piece";

export default class WhitePlayer extends Player {
  constructor(
    board: Board,
    whiteLegalMoves: List<Move>,
    blackLegalMoves: List<Move>
  ) {
    super(board, whiteLegalMoves, blackLegalMoves);
  }
  getActivePieces(): Piece[] {
    return this.board.getWhitePieces();
  }

  getAlliance(): AllianceType {
    return Alliance.WHITE;
  }

  getOpponent(): Player {
    return this.board.getBlackPlayer();
  }

  getCastleMoves(): Move[] {
    const castleMoves = [];

    const kingCastle = this.getKingCastleMove();
    if (kingCastle) {
      castleMoves.push(kingCastle);
    }

    const queenCastle = this.getQueenCastleMove();
    if (queenCastle) {
      castleMoves.push(queenCastle);
    }

    return castleMoves;
  }

  getKingCastleMove(): Move | null {
    if (this.king.isFirstMove() && !this.isCheck()) {
      const rookTile = this.board.getTile(63);
      if (rookTile.isTileOccupied()) {
        const rook = rookTile.getPiece();
        if (rook instanceof Rook && rook.isFirstMove()) {
          if (
            !this.isTileAttacked(62, this.opponentsMoves) &&
            !this.isTileAttacked(61, this.opponentsMoves) &&
            !this.board.getTile(62).isTileOccupied() &&
            !this.board.getTile(61).isTileOccupied()
          ) {
            return new KingCastleMove(this.board, this.king, 62, rook, 61);
          }
        }
      }
    }
    return null;
  }

  getQueenCastleMove(): Move | null {
    if (this.king.isFirstMove() && !this.isCheck()) {
      const rookTile = this.board.getTile(56);
      if (rookTile.isTileOccupied()) {
        const rook = rookTile.getPiece();
        if (rook instanceof Rook && rook.isFirstMove()) {
          if (
            !this.isTileAttacked(58, this.opponentsMoves) &&
            !this.isTileAttacked(59, this.opponentsMoves) &&
            !this.board.getTile(57).isTileOccupied() &&
            !this.board.getTile(58).isTileOccupied() &&
            !this.board.getTile(59).isTileOccupied()
          ) {
            return new QueenCastleMove(this.board, this.king, 58, rook, 59);
          }
        }
      }
    }
    return null;
  }
}
