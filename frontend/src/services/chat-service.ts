import { io, Socket } from "socket.io-client";
import api from "../context/apiJWT";

const API_URL = "http://localhost:3000/chat/";

class ChatService {
  socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
  }
  getChat = async (userId: string, friendId: string) => {
    try {
      const res = await api.get(`${API_URL}messages/${userId}/${friendId}`, {});
      return res.data;
    } catch (err) {
      console.error("Error fetching chat:", err);
      return null;
    }
  };
}
export const chatService = new ChatService();
