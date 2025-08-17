import { Alliance, type AllianceType } from "../boardLogic/Alliance";
import Pawn from "./Pawn";
import Rook from "./Rook";
import Knight from "./Knight";
import Bishop from "./Bishop";
import Queen from "./Queen";
import King from "./King";
import Piece from "./Piece";

export default class PieceFactory {
  static create(
    piece: string,
    position: number,
    alliance: "White" | "Black"
  ): Piece {
    const pieceAlliance: AllianceType =
      alliance == "White" ? Alliance.WHITE : Alliance.BLACK;
    switch (piece) {
      case "P":
        return new Pawn(position, pieceAlliance);
      case "R":
        return new Rook(position, pieceAlliance);
      case "N":
        return new Knight(position, pieceAlliance);
      case "B":
        return new Bishop(position, pieceAlliance);
      case "Q":
        return new Queen(position, pieceAlliance);
      case "K":
        return new King(position, pieceAlliance);
      default:
        throw new Error(`Unknown piece type: ${piece}`);
    }
  }
}
