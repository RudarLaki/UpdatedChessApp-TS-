export default class BoardUtils {
  static FIRST_COLUMN = BoardUtils.initCol(0);
  static SECOND_COLUMN = BoardUtils.initCol(1);
  static THIRD_COLUMN = BoardUtils.initCol(2);
  static FOURTH_COLUMN = BoardUtils.initCol(3);
  static FIFTH_COLUMN = BoardUtils.initCol(4);
  static SIXTH_COLUMN = BoardUtils.initCol(5);
  static SEVENTH_COLUMN = BoardUtils.initCol(6);
  static EIGHT_COLUMN = BoardUtils.initCol(7);

  static FIRST_ROW = BoardUtils.initRow(7);
  static SECOND_ROW = BoardUtils.initRow(6);
  static THIRD_ROW = BoardUtils.initRow(5);
  static FOURTH_ROW = BoardUtils.initRow(4);
  static FIFTH_ROW = BoardUtils.initRow(3);
  static SIXTH_ROW = BoardUtils.initRow(2);
  static SEVENTH_ROW = BoardUtils.initRow(1);
  static EIGHT_ROW = BoardUtils.initRow(0);

  static initCol(col: number): boolean[] {
    const column = Array(64).fill(false);
    for (let i = 0; i < 64; i++) {
      if (i % 8 === col) {
        column[i] = true;
      }
    }
    return column;
  }

  static initRow(row: number): boolean[] {
    const rowArray = Array(64).fill(false);
    for (let i = 0; i < 64; i++) {
      if (Math.floor(i / 8) === row) {
        rowArray[i] = true;
      }
    }
    return rowArray;
  }

  static isValidTileCoordinate(coordinate: number): boolean {
    return coordinate >= 0 && coordinate < 64;
  }

  constructor() {
    throw new Error("BoardUtils is a static class and cannot be instantiated.");
  }
}
