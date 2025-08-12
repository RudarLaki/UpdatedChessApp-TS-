import "../../styles/Tile.css";

import type { DragEvent, FC } from "react";
import type { TileProps } from "../../types/TileProps";
import PieceComp from "./Piece";

const Tile: FC<TileProps> = ({
  row,
  col,
  piece,
  isKingInCheck,
  isHighlighted,
  onDropPiece,
  onClick,
}) => {
  const isLight = (row + (col % 2)) % 2;
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"), 10);
    onDropPiece(fromIndex);
  };

  return (
    <div
      className={[
        "tile",
        isLight ? "light" : "dark",
        piece ? "piece" : "",
        piece && isHighlighted ? "circle" : "",
        !piece && isHighlighted ? "dot" : "",
        isKingInCheck ? "king-check" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <PieceComp piece={piece} className={"game"} />
    </div>
  );
};
export default Tile;
