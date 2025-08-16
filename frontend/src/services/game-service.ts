const API_URL = "http://localhost:3000/game/";

class GameService {
  startGame = async (
    whitePlayerId: string,
    blackPlayerId: string,
    userColor: string,
    roomId: string,
    timeControl: { matchTime: number; addition: number }
  ) => {
    const res = await fetch(API_URL + "start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whitePlayerId,
        blackPlayerId,
        userColor,
        roomId,
        timeControl,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed storing starting game");
    }

    return res.json();
  };
}
export const gameService = new GameService();
