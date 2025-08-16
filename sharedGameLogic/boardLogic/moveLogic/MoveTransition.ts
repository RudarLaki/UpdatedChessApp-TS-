import type Board from "../Board";
import type { Move } from "./Move";
import type { MoveStatusType } from "./MoveStatus";

export default class MoveTransition {
  board: Board;
  move: Move | null | undefined;
  moveStatus: MoveStatusType;
  constructor(
    board: Board,
    move: Move | null | undefined,
    moveStatus: MoveStatusType
  ) {
    this.board = board;
    this.move = move;
    this.moveStatus = moveStatus;
  }

  getMoveStatus() {
    return this.moveStatus;
  }

  getBoard() {
    return this.board;
  }

  getMove() {
    return this.move;
  }
}
