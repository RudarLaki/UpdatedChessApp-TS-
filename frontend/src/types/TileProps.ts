import type Piece from "../../../sharedGameLogic/pieceLogic/Piece";

export type TileProps = {
  row: number;
  col: number;
  piece: Piece | null;
  isKingInCheck: boolean;
  isHighlighted: boolean;
  onDropPiece: (fromIndex: number) => void;
  onClick: () => void;
};
