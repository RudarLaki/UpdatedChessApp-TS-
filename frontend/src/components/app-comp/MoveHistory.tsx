import type { FC } from "react";
import "../../styles/MoveHistory.css";

type MoveHistoryProps = {
  moveHistory:
    | {
        from: number;
        to: number;
        notation: string;
      }[]
    | null;
};

const MoveHistory: FC<MoveHistoryProps> = ({ moveHistory }) => {
  if (!moveHistory || moveHistory.length === 0) return <div>No moves yet</div>;

  // Group moves into pairs
  const rows: { white: string; black?: string }[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    rows.push({
      white: moveHistory[i].notation,
      black: moveHistory[i + 1]?.notation,
    });
  }

  return (
    <div className="game-history">
      {rows.map((row, index) => (
        <div className="move-container" key={index}>
          <div className="index">{index + 1}</div>
          <div className="move-one">{row.white}</div>
          <div className="move-one">{row.black ?? ""}</div>
        </div>
      ))}
    </div>
  );
};

export default MoveHistory;
