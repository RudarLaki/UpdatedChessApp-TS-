export type SerializedPiece = {
  piece: string;
  pieceAlliance: "White" | "Black";
  piecePosition: number;
};

export type GameState = {
  pieces: SerializedPiece[];
  turn: "White" | "Black";
  enPassant?: number | null;
  castlingRights: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
};

export type StartGameRequest = {
  whitePlayerId: string;
  blackPlayerId: string;
  roomId: string;
  timeControl: { initial: number; increment: number };
};

export type SendMoveRequest = {
  roomId: string;
  moveData: { from: number; to: number };
};

export type GetMoveRequest = {
  moveData: { from: number; to: number };
};

export type SendMessageRequest = {
  userId: string;
  friendId: string;
  roomId: string;
  message: string;
  sentAt: Date;
};

export type GetMessageRequest = {
  message: string;
  id: string;
  messageId: string;
  receiverId: string;
  senderId: string;
  sentAt: string;
};
