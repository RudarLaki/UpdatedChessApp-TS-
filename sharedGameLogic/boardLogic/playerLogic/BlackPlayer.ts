import Rook from "../../pieceLogic/Rook";
import Player from "./Player";
import { Alliance } from "../Alliance";
import type Board from "../Board";
import type { List } from "immutable";
import { KingCastleMove, QueenCastleMove, type Move } from "../moveLogic/Move";

export default class BlackPlayer extends Player {
  constructor(
    board: Board,
    whiteLegalMoves: List<Move>,
    blackLegalMoves: List<Move>
  ) {
    super(board, blackLegalMoves, whiteLegalMoves);
  }

  getActivePieces() {
    return this.board.getBlackPieces();
  }

  getAlliance() {
    return Alliance.BLACK;
  }

  getOpponent() {
    return this.board.getWhitePlayer();
  }

  getCastleMoves() {
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
      const rookTile = this.board.getTile(7);
      if (rookTile.isTileOccupied()) {
        const rook = rookTile.getPiece();
        if (rook instanceof Rook && rook.isFirstMove()) {
          if (
            !this.isTileAttacked(5, this.opponentsMoves) &&
            !this.isTileAttacked(6, this.opponentsMoves) &&
            !this.board.getTile(5)!.isTileOccupied() &&
            !this.board.getTile(6)!.isTileOccupied()
          ) {
            return new KingCastleMove(this.board, this.king, 6, rook, 5);
          }
        }
      }
    }
    return null;
  }

  getQueenCastleMove(): Move | null {
    if (this.king.isFirstMove() && !this.isCheck()) {
      const rookTile = this.board.getTile(0);
      if (rookTile.isTileOccupied()) {
        const rook = rookTile.getPiece();
        if (rook instanceof Rook && rook.isFirstMove()) {
          if (
            !this.isTileAttacked(2, this.opponentsMoves) &&
            !this.isTileAttacked(3, this.opponentsMoves) &&
            !this.board.getTile(1)!.isTileOccupied() &&
            !this.board.getTile(2)!.isTileOccupied() &&
            !this.board.getTile(3)!.isTileOccupied()
          ) {
            return new QueenCastleMove(this.board, this.king, 2, rook, 3);
          }
        }
      }
    }
    return null;
  }
}
