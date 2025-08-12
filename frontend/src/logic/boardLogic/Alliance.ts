import type BlackPlayer from "./playerLogic/BlackPlayer";
import type WhitePlayer from "./playerLogic/WhitePlayer";

export const Alliance = Object.freeze({
  WHITE: {
    getDirection: () => -1,
    choosePlayer: (whitePlayer: WhitePlayer, _) => whitePlayer,
    toString: () => "White",
  },
  BLACK: {
    getDirection: () => 1,
    choosePlayer: (_, blackPlayer: BlackPlayer) => blackPlayer,
    toString: () => "Black",
  },
});
export type AllianceType = typeof Alliance.WHITE | typeof Alliance.BLACK;
