import Piece from "./Piece";
import Queen from "./Queen";
import Rook from "./Rook";
import Bishop from "./Bishop";
import Knight from "./Knight";
import BoardUtils from "../boardLogic/BoardUtils";
import {
  PawnMove,
  PawnAttackMove,
  PawnJump,
  PawnEnPassantAttackMove,
  PawnPromotionMove,
  Move,
} from "../boardLogic/moveLogic/Move";
import type Board from "../boardLogic/Board";
import { Alliance, type AllianceType } from "../boardLogic/Alliance";

const CANDIDATE_MOVE_COORDINATES = [8, 16, 7, 9];

export default class Pawn extends Piece {
  firstMove: boolean;
  constructor(
    piecePosition: number,
    pieceAlliance: AllianceType,
    firstMove = true
  ) {
    super(piecePosition, pieceAlliance);
    this.firstMove = firstMove;
  }

  isFirstMove() {
    return this.firstMove;
  }

  toString() {
    return "P";
  }

  movePiece(move: Move): Pawn {
    return new Pawn(
      move.getDestinationCordinate(),
      this.getPieceAlliance(),
      false
    );
  }

  calculateLegalMoves(board: Board): Move[] {
    const legalMoves = [];
    const direction = this.pieceAlliance == Alliance.WHITE ? -1 : 1;

    for (const candidate of CANDIDATE_MOVE_COORDINATES) {
      const candidateDestination = this.piecePosition + direction * candidate;

      if (!this.isValidMove(this.piecePosition, candidateDestination)) continue;

      const destinationTile = board.getTile(candidateDestination);

      if (candidate === 8 && !destinationTile.isTileOccupied()) {
        const isPromotionRow =
          (this.pieceAlliance == Alliance.WHITE && candidateDestination < 8) ||
          (this.pieceAlliance == Alliance.BLACK && candidateDestination >= 56);

        const baseMove = new PawnMove(board, this, candidateDestination);

        if (isPromotionRow) {
          legalMoves.push(
            new PawnPromotionMove(
              baseMove,
              new Queen(candidateDestination, this.pieceAlliance)
            )
          );
          legalMoves.push(
            new PawnPromotionMove(
              baseMove,
              new Rook(candidateDestination, this.pieceAlliance, false)
            )
          );
          legalMoves.push(
            new PawnPromotionMove(
              baseMove,
              new Bishop(candidateDestination, this.pieceAlliance)
            )
          );
          legalMoves.push(
            new PawnPromotionMove(
              baseMove,
              new Knight(candidateDestination, this.pieceAlliance)
            )
          );
        } else {
          legalMoves.push(baseMove);
        }
      }

      if (
        candidate === 16 &&
        this.isFirstMove() &&
        !destinationTile.isTileOccupied() &&
        !board.getTile(this.piecePosition + 8 * direction).isTileOccupied()
      ) {
        legalMoves.push(new PawnJump(board, this, candidateDestination));
      }

      if (candidate === 7 || candidate === 9) {
        const isOnFirstColumn = BoardUtils.FIRST_COLUMN[this.piecePosition];
        const isOnEighthColumn = BoardUtils.EIGHT_COLUMN[this.piecePosition];

        if (
          (candidate === 7 &&
            ((this.pieceAlliance == Alliance.WHITE && !isOnEighthColumn) ||
              (this.pieceAlliance == Alliance.BLACK && !isOnFirstColumn))) ||
          (candidate === 9 &&
            ((this.pieceAlliance == Alliance.WHITE && !isOnFirstColumn) ||
              (this.pieceAlliance == Alliance.BLACK && !isOnEighthColumn)))
        ) {
          const attackedTile = board.getTile(candidateDestination);

          if (attackedTile.isTileOccupied()) {
            const attackedPiece = attackedTile.getPiece();
            if (
              attackedPiece &&
              attackedPiece.pieceAlliance !== this.pieceAlliance
            ) {
              const baseAttack = new PawnAttackMove(
                board,
                this,
                candidateDestination,
                attackedPiece
              );
              const isPromotionRow =
                (this.pieceAlliance == Alliance.WHITE &&
                  candidateDestination < 8) ||
                (this.pieceAlliance == Alliance.BLACK &&
                  candidateDestination >= 56);

              if (isPromotionRow) {
                legalMoves.push(
                  new PawnPromotionMove(
                    baseAttack,
                    new Queen(candidateDestination, this.pieceAlliance)
                  )
                );
                legalMoves.push(
                  new PawnPromotionMove(
                    baseAttack,
                    new Rook(candidateDestination, this.pieceAlliance)
                  )
                );
                legalMoves.push(
                  new PawnPromotionMove(
                    baseAttack,
                    new Bishop(candidateDestination, this.pieceAlliance)
                  )
                );
                legalMoves.push(
                  new PawnPromotionMove(
                    baseAttack,
                    new Knight(candidateDestination, this.pieceAlliance)
                  )
                );
              } else {
                legalMoves.push(baseAttack);
              }
            }
          } else if (board.enPassantPawn != null) {
            const enPassantPawn = board.enPassantPawn;

            if (
              enPassantPawn.pieceAlliance !== this.pieceAlliance &&
              enPassantPawn.piecePosition ===
                this.piecePosition + direction * (candidate === 7 ? -1 : 1)
            ) {
              legalMoves.push(
                new PawnEnPassantAttackMove(
                  board,
                  this,
                  candidateDestination,
                  enPassantPawn
                )
              );
            }
          }
        }
      }
    }

    return legalMoves;
  }

  isValidMove(currentPosition: number, candidateDestination: number) {
    return (
      candidateDestination >= 0 &&
      candidateDestination < 64 &&
      !(
        (BoardUtils.FIRST_COLUMN[currentPosition] &&
          BoardUtils.EIGHT_COLUMN[candidateDestination]) ||
        (BoardUtils.EIGHT_COLUMN[currentPosition] &&
          BoardUtils.FIRST_COLUMN[candidateDestination])
      )
    );
  }
}
