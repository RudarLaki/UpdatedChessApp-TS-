import type BlackPlayer from "./playerLogic/BlackPlayer";
import type WhitePlayer from "./playerLogic/WhitePlayer";

export const Alliance = Object.freeze({
  WHITE: {
    getDirection: () => -1 as -1 | 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    choosePlayer: (whitePlayer: WhitePlayer, _blackPlayer: BlackPlayer) =>
      whitePlayer,
    toString: () => "White" as "Black" | "White",
  },
  BLACK: {
    getDirection: () => 1 as -1 | 1,
    choosePlayer: (_whitePlayer: WhitePlayer, blackPlayer: BlackPlayer) =>
      blackPlayer,
    toString: () => "Black" as "Black" | "White",
  },
});
export type AllianceType = typeof Alliance.WHITE | typeof Alliance.BLACK;
