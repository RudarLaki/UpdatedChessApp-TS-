import type { AllianceType } from "../boardLogic/Alliance";
import type Board from "../boardLogic/Board";
import type { Move } from "../boardLogic/moveLogic/Move";

export default class Piece {
  piecePosition: number;
  pieceAlliance: AllianceType;
  constructor(piecePosition: number, pieceAlliance: AllianceType) {
    this.piecePosition = piecePosition;
    this.pieceAlliance = pieceAlliance;
  }

  equals(object: Piece) {
    if (object === this) return true;
    if (object == null) return false;
    if (!(object instanceof Piece)) return false;

    return (
      this.pieceAlliance === object.getPieceAlliance() &&
      this.piecePosition === object.getPiecePosition() &&
      this.toString() === object.toString()
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculateLegalMoves(_board: Board): Move[] {
    throw new Error("Method 'calculateLegalMoves(board)' must be implemented.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  movePiece(_move: Move): Piece {
    throw new Error("Method 'movePiece(move)' must be implemented.");
  }

  getPieceAlliance() {
    return this.pieceAlliance;
  }

  getPiecePosition() {
    return this.piecePosition;
  }

  isFirstMove() {
    return false;
  }

  static PieceType = {
    PAWN: "P",
    BISHOP: "B",
    KNIGHT: "N",
    ROOK: "R",
    KING: "K",
    QUEEN: "Q",
  };
}
