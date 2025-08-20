import type { DragEvent, FC } from "react";
import type { PieceProps } from "../../types/PieceProps";

const PieceComp: FC<PieceProps> = ({ piece, className }) => {
  if (!piece) return;
  const pieceName = piece.toString().substring(0, 1);
  const pieceAlliance = piece.getPieceAlliance().toString().substring(0, 1);
  const imageSrc = `/slike-figura/chess.com/${pieceAlliance}${pieceName}.png`;

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    e.dataTransfer.setData("fromIndex", piece.getPiecePosition().toString());
  };

  return (
    <img
      draggable
      onDragStart={handleDragStart}
      src={imageSrc}
      alt={`${pieceName} ${pieceAlliance}`}
      className={`piece ${className}`}
    />
  );
};

export default PieceComp;
