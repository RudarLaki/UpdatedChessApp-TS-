import type { FC } from "react";
import type { Move } from "../../logic/boardLogic/moveLogic/Move";
import "../../styles/MoveHistory.css";

type MoveHistoryProps = {
  moveHistory:
    | {
        whiteMove: Move | null;
        blackMove: Move | null;
      }[]
    | null;
};

const MoveHistory: FC<MoveHistoryProps> = ({ moveHistory }) => {
  return (
    <div className="game-history">
      {moveHistory?.map((moves, index) => (
        <div className="move-container" key={index}>
          <div className="index">{index + 1}</div>:
          <div className="move-one">{moves.whiteMove!.toString()}</div>
          <div className={moves.blackMove ? "move-one" : "move-empty"}>
            {moves.blackMove?.toString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoveHistory;
