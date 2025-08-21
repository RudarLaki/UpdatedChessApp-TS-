const API_URL = "http://13.61.15.90:3000/ai-game/";

class AiBotService {
  startGame = async (userId: number, level: number) => {
    const res = await fetch(API_URL + "start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, level }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed starting game");
    }
    const ret = await res.json();
    return ret;
  };

  makeMove = async (roomId: string, moves: string[]) => {
    const res = await fetch(API_URL + "move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, moves }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed making move");
    }
    return res.json();
  };

  close = async (userId: string) => {
    const res = await fetch(API_URL + "close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed closing game");
    }
    return res.json();
  };

  reconnect = async (userId: string) => {
    const res = await fetch(API_URL + "reconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed reconnecting to game");
    }
    return res.json();
  };
}

export const aiBotService = new AiBotService();
