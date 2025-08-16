import type Piece from "../pieceLogic/Piece";

// function freezeMap(map: Map) {
//   return Object.freeze(map);
// }

export default class Tile {
  tileCoordinate: number;
  constructor(tileCoordinate: number) {
    this.tileCoordinate = tileCoordinate;
  }

  static createTile(tileCoordinate: number, piece: Piece) {
    return piece != null
      ? new OccupiedTile(tileCoordinate, piece)
      : new EmptyTile(tileCoordinate);
    // Tile.EMPTY_TILES[tileCoordinate];
  }

  isTileOccupied(): boolean {
    throw new Error("Must be implemented by subclass");
  }

  getPiece(): Piece | null {
    throw new Error("Must be implemented by subclass");
  }

  getTileCoordinate(): number {
    return this.tileCoordinate;
  }

  toString(): string {
    throw new Error("Must be implemented by subclass");
  }
}

export class EmptyTile extends Tile {
  constructor(tileCoordinate: number) {
    super(tileCoordinate);
  }

  isTileOccupied(): boolean {
    return false;
  }

  getPiece(): Piece | null {
    return null;
  }

  toString(): string {
    return `${String.fromCharCode(65 + (this.tileCoordinate % 8))}${
      8 - Math.floor(this.tileCoordinate / 8)
    }`;
  }
}

export class OccupiedTile extends Tile {
  pieceOnTile: Piece;
  constructor(tileCoordinate: number, pieceOnTile: Piece) {
    super(tileCoordinate);
    this.pieceOnTile = pieceOnTile;
  }

  isTileOccupied(): boolean {
    return true;
  }

  getPiece(): Piece {
    return this.pieceOnTile;
  }

  toString(): string {
    const col = String.fromCharCode(65 + (this.tileCoordinate % 8)); // A-H
    const row = 8 - Math.floor(this.tileCoordinate / 8); // 8-1
    return `${col}${row}${this.getPiece().toString()}`;
  }
}

// // ✅ Static property initialized AFTER all class declarations
// const EMPTY_TILES = (function createEmptyTiles() {
//   const emptyTileMap = {};
//   for (let i = 0; i < 64; i++) {
//     emptyTileMap[i] = new EmptyTile(i);
//   }
//   return freezeMap(emptyTileMap);
// })();
