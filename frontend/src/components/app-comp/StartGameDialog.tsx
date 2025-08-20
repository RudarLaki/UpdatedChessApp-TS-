import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/StartGameDialog.css";

type OpponentType = "player" | "bot";

type StartGameDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  botOrPlayer: OpponentType;
};

const StartGameDialog: FC<StartGameDialogProps> = ({
  isOpen,
  setIsOpen,
  botOrPlayer,
}) => {
  const [time, setTime] = useState(600);
  const [addition, setAddition] = useState(0);

  const [opponent, setOpponent] = useState("");
  const navigate = useNavigate();
  const botRatings = [
    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
    2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200,
    3300, 3400, 3500, 3600,
  ];
  const friendOptions = [
    "Random Player",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Hannah",
    "Ivan",
    "Julia",
  ];
  const arrayToShow = botOrPlayer == "bot" ? botRatings : friendOptions;

  if (isOpen == false) return;
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
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          >
            {arrayToShow.map((select, index) => (
              <option
                key={index}
                value={select === "Random Player" ? "random" : select}
              >
                {select}
              </option>
            ))}
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
              navigate("/game", {
                state: { matchTime: time, addition, opponent, botOrPlayer },
              });
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
