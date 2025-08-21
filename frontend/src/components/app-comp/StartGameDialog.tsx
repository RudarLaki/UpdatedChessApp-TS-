import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/StartGameDialog.css";

type OpponentType = "player" | "bot";

type StartGameDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  botOrPlayer: OpponentType;
};

const botRatings = [
  800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
  2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300,
  3400, 3500, 3600,
];

const friendOptions = [
  { label: "Random Player", value: "random" },
  { label: "Alice", value: "Alice" },
  { label: "Bob", value: "Bob" },
  { label: "Charlie", value: "Charlie" },
  { label: "Diana", value: "Diana" },
  { label: "Ethan", value: "Ethan" },
  { label: "Fiona", value: "Fiona" },
  { label: "George", value: "George" },
  { label: "Hannah", value: "Hannah" },
  { label: "Ivan", value: "Ivan" },
  { label: "Julia", value: "Julia" },
];

const StartGameDialog: FC<StartGameDialogProps> = ({
  isOpen,
  setIsOpen,
  botOrPlayer,
}) => {
  const navigate = useNavigate();

  // State
  const [time, setTime] = useState(10);
  const [increment, setIncrement] = useState(0);

  const [selectedFriend, setSelectedFriend] = useState("random");
  const [selectedBot, setSelectedBot] = useState(botRatings[0]);

  // Handle start game
  const handleStart = () => {
    const opponent = botOrPlayer === "bot" ? selectedBot : selectedFriend;

    navigate("/game", {
      state: {
        matchTime: time,
        addition: increment,
        opponent,
        botOrPlayer,
      },
    });

    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      as="div"
      className="dialog-overlay"
    >
      <DialogPanel className="dialog-panel">
        <DialogTitle className="dialog-title">Start a New Game</DialogTitle>
        <Description className="dialog-description">
          Choose your opponent and time control for the match.
        </Description>

        {/* Opponent Selector */}
        <label className="dialog-label">
          Opponent:
          {botOrPlayer === "bot" ? (
            <select
              className="dialog-select"
              value={selectedBot}
              onChange={(e) => setSelectedBot(Number(e.target.value))}
            >
              {botRatings.map((rating, idx) => (
                <option key={idx} value={rating}>
                  Bot (Elo {rating})
                </option>
              ))}
            </select>
          ) : (
            <select
              className="dialog-select"
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
            >
              {friendOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Time Control */}
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
              value={increment}
              onChange={(e) => setIncrement(Number(e.target.value))}
            />
          </div>
        </label>

        {/* Buttons */}
        <div className="dialog-buttons">
          <button className="dialog-cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button className="dialog-start" onClick={handleStart}>
            Start Game
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default StartGameDialog;
