import { List } from "immutable";
import King from "../../pieceLogic/King";
import type Piece from "../../pieceLogic/Piece";
import type { AllianceType } from "../Alliance";
import type Board from "../Board";
import { Move } from "../moveLogic/Move";
import { MoveStatus } from "../moveLogic/MoveStatus";
import MoveTransition from "../moveLogic/MoveTransition";

export default class Player {
  board: Board;
  opponentsMoves: List<Move>;
  king: King;
  legalMoves: List<Move>;
  constructor(
    board: Board,
    legalMoves: List<Move>,
    opponentsMoves: List<Move>
  ) {
    this.board = board;
    this.opponentsMoves = opponentsMoves;
    this.king = this.establishKing();
    this.legalMoves = legalMoves.concat(List(this.getCastleMoves()));
  }

  establishKing(): King {
    for (const piece of this.getActivePieces()) {
      if (piece.toString() === "K") {
        if (piece instanceof King) {
          const king: King = piece;
          return king;
        }
      }
    }
    throw new Error("Error: No king found!");
  }

  getQueenCastleMove(): Move | null {
    throw new Error("Must be implemented by subclass");
  }

  getKingCastleMove(): Move | null {
    throw new Error("Must be implemented by subclass");
  }

  getCastleMoves(): Move[] {
    throw new Error("Must be implemented by subclass");
  }

  getActivePieces(): Piece[] {
    throw new Error("Must be implemented by subclass");
  }

  getAlliance(): AllianceType {
    throw new Error("Must be implemented by subclass");
  }

  getOpponent(): Player {
    throw new Error("Must be implemented by subclass");
  }

  getKing(): King {
    return this.king;
  }

  isMoveLegal(move: Move): Move | undefined {
    return this.legalMoves.find(
      (move1) =>
        move1.getMovedPiece().getPiecePosition() ==
          move.getMovedPiece().getPiecePosition() &&
        move1.getDestinationCordinate() == move.getDestinationCordinate()
    );
  }

  isCheck(): boolean {
    let check = false;
    this.opponentsMoves.forEach((move) => {
      if (move.getDestinationCordinate() == this.king.getPiecePosition())
        check = true;
    });
    return check;
  }

  getLegalMoves(): List<Move> {
    return this.legalMoves;
  }

  isCheckMate(): boolean {
    return this.isCheck() && this.noSafeMove();
  }

  noSafeMove(): boolean {
    for (const move of this.legalMoves) {
      const transitionBoard = move.executeMove();
      if (!transitionBoard.getCurrentPlayer().getOpponent().isCheck()) {
        return false;
      }
    }
    return true;
  }

  isInStaleMate(): boolean {
    return !this.isCheck() && this.noSafeMove();
  }

  isCastled(): boolean {
    return false;
  }

  isTileAttacked(tileCordinate: number, opponentsMoves: List<Move>): boolean {
    return opponentsMoves.some(
      (move) => move.getDestinationCordinate() === tileCordinate
    );
  }

  makeMove(move: Move | null | undefined): MoveTransition {
    if (move == undefined || move == null || !this.isMoveLegal(move)) {
      return new MoveTransition(this.board, move, MoveStatus.ILLEGAL_MOVE);
    }

    const transitionBoard = move.executeMove();
    const kingsTile = transitionBoard
      .getCurrentPlayer()
      .getOpponent()
      .getKing()
      .getPiecePosition();

    const move1 = transitionBoard
      .getCurrentPlayer()
      .getLegalMoves()
      .find((move1: Move) => move1.getDestinationCordinate() == kingsTile);
    if (move1 !== undefined) {
      return new MoveTransition(
        this.board,
        move,
        MoveStatus.LEAVES_PLAYER_IN_CHECK
      );
    }
    return new MoveTransition(transitionBoard, move, MoveStatus.DONE);
  }
}
