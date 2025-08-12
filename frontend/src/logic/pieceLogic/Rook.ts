import Piece from "./Piece";
import { MajorMove, AttackMove, Move } from "../boardLogic/moveLogic/Move";
import { type AllianceType } from "../boardLogic/Alliance";
import type Board from "../boardLogic/Board";

const CANDIDATE_DIRECTIONS = [-8, -1, 1, 8]; // All directions

export default class Rook extends Piece {
  firstMove: boolean;
  constructor(
    piecePosition: number,
    pieceAlliance: AllianceType,
    firstMove: boolean = true
  ) {
    super(piecePosition, pieceAlliance);
    this.firstMove = firstMove;
  }

  calculateLegalMoves(board: Board): Move[] {
    const legalMoves = [];

    for (const direction of CANDIDATE_DIRECTIONS) {
      let current = this.piecePosition;

      while (this.isValidMove(direction, current)) {
        current += direction;

        if (current < 0 || current >= 64) break;

        const tile = board.getTile(current)!;
        if (!tile.isTileOccupied()) {
          legalMoves.push(new MajorMove(board, this, current));
        } else {
          const piece = tile.getPiece()!;
          if (piece.pieceAlliance !== this.pieceAlliance) {
            legalMoves.push(new AttackMove(board, this, current, piece));
          }
          break; // Blocked after capture or same-side piece
        }
      }
    }

    return legalMoves;
  }

  isValidMove(direction: number, current: number) {
    const dest = current + direction;
    if (dest < 0 || dest >= 64) return false;

    const sameRowWrap =
      (current % 8 === 0 && dest % 8 === 7) ||
      (current % 8 === 7 && dest % 8 === 0);
    return !sameRowWrap;
  }

  movePiece(move: Move) {
    return new Rook(move.destinationCordinate, this.pieceAlliance, false);
  }

  isFirstMove() {
    return this.firstMove;
  }

  toString() {
    return "R";
  }
}
