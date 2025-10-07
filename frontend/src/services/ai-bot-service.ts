const API_URL = "/ai-game/";
// const API_URL = "http://localhost:3000/ai-game/";
import api from "../context/apiJWT";

class AiBotService {
  startGame = async (userId: number, level: number) => {
    try {
      const res = await api.post(`${API_URL}start`, { userId, level });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };

  makeMove = async (roomId: string, moves: string[]) => {
    try {
      const res = await api.post(API_URL + "move", { roomId, moves });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };

  close = async (userId: string) => {
    try {
      const res = await api.post(API_URL + "close", { userId });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };

  reconnect = async (userId: string) => {
    try {
      const res = await api.post(API_URL + "reconnect", { userId });
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };
}

export const aiBotService = new AiBotService();
