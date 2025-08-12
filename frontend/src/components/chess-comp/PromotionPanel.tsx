import type { AllianceType } from "../../logic/boardLogic/Alliance";

type PromotionPanelProps = {
  alliance: AllianceType;
  onSelect: (pieceType: string) => void;
};

const PromotionPanel: React.FC<PromotionPanelProps> = ({
  alliance,
  onSelect,
}) => {
  const pieces = ["Queen", "Rook", "Bishop", "Knight"];
  const colorPrefix = alliance.toString() === "White" ? "W" : "B";

  return (
    <div className="promotion-overlay">
      <div className="promotion-options">
        {pieces.map((piece) => (
          <button
            key={piece}
            onClick={() => onSelect(piece)}
            className="promotion-option"
          >
            {colorPrefix}
            {piece}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromotionPanel;
