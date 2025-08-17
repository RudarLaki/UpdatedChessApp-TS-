import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/StartGameDialog.css";

type StartGameDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const StartGameDialog: FC<StartGameDialogProps> = ({ isOpen, setIsOpen }) => {
  const [time, setTime] = useState(600);
  const [addition, setAddition] = useState(0);

  const [opponentType, setOpponentType] = useState("");
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onClose={close} as="div" className="dialog-overlay">
      <DialogPanel className="dialog-panel">
        <DialogTitle className="dialog-title">Start a New Game</DialogTitle>
        <Description className="dialog-description">
          Choose your opponent and time control for the match.
        </Description>

        <label className="dialog-label">
          Opponent:
          <select
            className="dialog-select"
            value={opponentType}
            onChange={(e) => setOpponentType(e.target.value)}
          >
            <option value="random">Random Opponent</option>
            <option value="friend">Friend</option>
          </select>
        </label>

        <label className="dialog-label">
          Time Control (minutes + addition):
          <div style={{ display: "flex", padding: "15px", gap: "20px" }}>
            <input
              className="dialog-input"
              type="number"
              min={1}
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
            <input
              className="dialog-input"
              type="number"
              min={1}
              value={addition}
              onChange={(e) => setAddition(Number(e.target.value))}
            />
          </div>
        </label>

        <div className="dialog-buttons">
          <button className="dialog-cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button
            className="dialog-start"
            onClick={() => {
              navigate("/game", { state: { time, addition } });
            }}
          >
            Start Game
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default StartGameDialog;
