import type Board from "../boardLogic/Board";
import type { Move } from "../boardLogic/moveLogic/Move";
import { type AllianceType } from "../boardLogic/Alliance";

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

  // static createPieceFromSelection(pieceName, alliance, tileID) {
  //   switch (pieceName) {
  //     case "P":
  //       return new Pawn(tileID, alliance, false);
  //     case "N":
  //       return new Knight(tileID, alliance);
  //     case "B":
  //       return new Bishop(tileID, alliance);
  //     case "R":
  //       return new Rook(tileID, alliance, false);
  //     case "Q":
  //       return new Queen(tileID, alliance);
  //     case "K":
  //       return new King(tileID, alliance, false);
  //     default:
  //       return null;
  //   }
  // }

  static PieceType = {
    PAWN: "P",
    BISHOP: "B",
    KNIGHT: "N",
    ROOK: "R",
    KING: "K",
    QUEEN: "Q",
  };
}
