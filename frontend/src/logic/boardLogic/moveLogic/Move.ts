import Board from "../Board";
import Rook from "../../pieceLogic/Rook";
import Piece from "../../pieceLogic/Piece";
import type King from "../../pieceLogic/King";
import Pawn from "../../pieceLogic/Pawn";

const niz = ["a", "b", "c", "d", "e", "f", "g", "h"];
export class Move {
  board: Board;
  movedPiece: Piece;
  destinationCordinate: number;
  constructor(board: Board, movedPiece: Piece, destinationCordinate: number) {
    this.board = board;
    this.movedPiece = movedPiece;
    this.destinationCordinate = destinationCordinate;
  }

  getBoard() {
    return this.board;
  }
  getMovedPiece() {
    return this.movedPiece;
  }
  getDestinationCordinate() {
    return this.destinationCordinate;
  }
  executeMove() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece.movePiece(this));
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );
    return builder.build();
  }

  undo() {
    throw new Error("Abstract method 'undo' must be implemented by subclasses");
  }

  isAttack() {
    return false;
  }

  isCastlingMove() {
    return false;
  }

  getAttackedPiece(): Piece | null {
    return null;
  }

  equals(object: Move) {
    if (object == this) return true;
    if (!(object instanceof Move)) return false;
    if (
      object.board === this.board &&
      object.getDestinationCordinate() === this.getDestinationCordinate() &&
      this.movedPiece === object.movedPiece
    )
      return true;
  }
}

export class MajorMove extends Move {
  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }
  toString() {
    return (
      this.movedPiece.toString() +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class AttackMove extends Move {
  attackedPiece: Piece;
  constructor(
    board: Board,
    movedPiece: Piece,
    destinationCordinate: number,
    attackedPiece: Piece
  ) {
    super(board, movedPiece, destinationCordinate);
    this.attackedPiece = attackedPiece;
  }

  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setPiece(this.attackedPiece);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }

  isAttack(): boolean {
    return true;
  }

  getAttackedPiece(): Piece {
    return this.attackedPiece;
  }

  equals(object: AttackMove) {
    return (
      super.equals(object) &&
      object instanceof AttackMove &&
      this.attackedPiece.equals(object.attackedPiece)
    );
  }
  toString() {
    return (
      this.movedPiece.toString() +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class PawnMove extends MajorMove {
  toString(): string {
    return (
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}
export class PawnAttackMove extends AttackMove {
  string: string = "";
  constructor(
    board: Board,
    movedPiece: Piece,
    destinationCordinate: number,
    attackedPiece: Piece
  ) {
    super(board, movedPiece, destinationCordinate, attackedPiece);
    this.string = "";
  }
  toString(): string {
    return (
      niz[this.movedPiece.getPiecePosition() % 8] +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8))
    );
  }
}

export class PawnEnPassantAttackMove extends PawnAttackMove {
  executeMove() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.attackedPiece) builder.setPiece(piece);
      });

    const piece = this.movedPiece.movePiece(this);
    builder.setPiece(piece);
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );
    builder.setEnPassant(null);
    const newBoard = builder.build();
    this.string =
      niz[this.movedPiece.getPiecePosition()] +
      "x" +
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8));
    if (newBoard.getCurrentPlayer().isCheck()) this.string = this.string + "+";
    return newBoard;
  }
  toString() {
    return this.string;
  }
}

export class PawnJump extends MajorMove {
  string: string = "";
  executeMove() {
    const builder = new Board.Builder();
    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });
    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    const moved = this.movedPiece.movePiece(this);
    if (moved instanceof Pawn) {
      const pawn: Pawn = moved;
      builder.setPiece(pawn);
      builder.setEnPassant(pawn);
    }

    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );

    const newBoard = builder.build();
    this.string =
      niz[this.destinationCordinate % 8] +
      (8 - Math.floor(this.destinationCordinate / 8));
    if (newBoard.getCurrentPlayer().isCheck()) this.string = this.string + "+";
    return newBoard;
  }
  toString() {
    return this.string;
  }
}

export class CastleMove extends Move {
  rook: Rook;
  rookDestination: number;
  constructor(
    board: Board,
    king: King,
    kingDestination: number,
    rook: Rook,
    rookDestination: number
  ) {
    super(board, king, kingDestination);
    this.rook = rook;
    this.rookDestination = rookDestination;
  }

  executeMove() {
    const builder = new Board.Builder();
    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (
          piece.getPiecePosition() !== this.movedPiece.getPiecePosition() &&
          piece !== this.rook
        )
          builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    const newKing = this.movedPiece.movePiece(this);
    const newRook = new Rook(
      this.rookDestination,
      this.rook.getPieceAlliance(),
      false
    );

    builder.setPiece(newKing);
    builder.setPiece(newRook);
    builder.setNextMoveMaker(
      this.board.getCurrentPlayer().getOpponent().getAlliance()
    );

    return builder.build();
  }

  isCastlingMove() {
    return true;
  }

  undo() {
    const builder = new Board.Builder();

    this.board
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== this.movedPiece) builder.setPiece(piece);
      });

    this.board
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(this.movedPiece);
    builder.setPiece(this.rook);
    builder.setNextMoveMaker(this.board.getCurrentPlayer().getAlliance());

    return builder.build();
  }
}

export class KingCastleMove extends CastleMove {
  constructor(
    board: Board,
    king: King,
    kingDestionation: number,
    rook: Rook,
    rookDestination: number
  ) {
    super(board, king, kingDestionation, rook, rookDestination);
  }
  toString() {
    return "0-0";
  }
}
export class QueenCastleMove extends CastleMove {
  constructor(
    board: Board,
    king: King,
    kingDestionation: number,
    rook: Rook,
    rookDestination: number
  ) {
    super(board, king, kingDestionation, rook, rookDestination);
  }
  toString() {
    return "0-0-0";
  }
}

export class PawnPromotionMove extends Move {
  move: Move;
  promotingTo: Piece;
  string: string = "";
  constructor(move: Move, promotingTo: Piece) {
    super(move.board, move.movedPiece, move.destinationCordinate);
    this.move = move;
    this.promotingTo = promotingTo;
    this.string = "";
  }

  executeMove() {
    const builder = new Board.Builder();
    const original = this.move.executeMove();
    const pawn = original
      .getTile(this.move.getDestinationCordinate())!
      .getPiece();

    original
      .getCurrentPlayer()
      .getActivePieces()
      .forEach((piece: Piece) => {
        if (piece !== pawn) builder.setPiece(piece);
      });

    original
      .getCurrentPlayer()
      .getOpponent()
      .getActivePieces()
      .forEach((piece: Piece) => {
        builder.setPiece(piece);
      });

    builder.setPiece(pawn!);
    builder.setNextMoveMaker(original.getCurrentPlayer().getAlliance());
    const newBoard = builder.build();
    this.string = this.move.toString() + "=Q";
    if (newBoard.getCurrentPlayer().isCheck()) this.string = this.string + "+";
    return newBoard;
  }

  undo() {
    return this.move.undo();
  }
  toString() {
    return this.string;
  }
}

export class MoveFactory {
  static createMove(board: Board, source: number, destination: number) {
    const move = board
      .getCurrentPlayer()
      .getLegalMoves()
      .find(
        (move: Move) =>
          move.getMovedPiece().getPiecePosition() == source &&
          move.getDestinationCordinate() == destination
      );
    return move;
  }
}
export function putPiece(board: Board, newPiece: Piece) {
  const builder = new Board.Builder();
  const blackKingPos = board.getBlackPlayer().getKing().getPiecePosition();
  const whiteKingPos = board.getWhitePlayer().getKing().getPiecePosition();
  if (
    newPiece.getPiecePosition() === blackKingPos ||
    newPiece.getPiecePosition() === whiteKingPos
  )
    return board;
  board
    .getCurrentPlayer()
    .getActivePieces()
    .forEach((piece: Piece) => {
      if (piece.getPiecePosition() !== newPiece.getPiecePosition())
        builder.setPiece(piece);
    });
  board
    .getCurrentPlayer()
    .getOpponent()
    .getActivePieces()
    .forEach((piece: Piece) => {
      if (piece.getPiecePosition() !== newPiece.getPiecePosition())
        builder.setPiece(piece);
    });
  builder.setPiece(newPiece);
  builder.setNextMoveMaker(board.getCurrentPlayer().getAlliance());
  return builder.build();
}
export function removePiece(board: Board, tileID: number) {
  const builder = new Board.Builder();
  board
    .getCurrentPlayer()
    .getActivePieces()
    .forEach((piece: Piece) => {
      if (piece.getPiecePosition() !== tileID) builder.setPiece(piece);
    });
  board
    .getCurrentPlayer()
    .getOpponent()
    .getActivePieces()
    .forEach((piece: Piece) => {
      if (piece.getPiecePosition() !== tileID) builder.setPiece(piece);
    });
  builder.setNextMoveMaker(board.getCurrentPlayer().getAlliance());
  return builder.build();
}
