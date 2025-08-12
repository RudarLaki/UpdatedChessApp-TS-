import type { AllianceType } from "../../logic/boardLogic/Alliance";

type PromotionPanelProps = {
  alliance: AllianceType;
  onSelect: (pieceType: string) => void;
};

const PromotionPanel: React.FC<PromotionPanelProps> = ({
  alliance,
  onSelect,
}) => {
  return <div>{alliance.toString()}</div>;
};

export default PromotionPanel;
