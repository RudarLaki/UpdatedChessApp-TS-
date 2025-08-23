import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:3000/chat/";

class ChatService {
  socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
  }
  getChat = async (userId: string, friendId: string) => {
    try {
      const res = await fetch(`${API_URL}messages/${userId}/${friendId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chat");
      }
      const { messages } = await res.json();

      return messages; // e.g., { messages: [...] }
    } catch (err) {
      console.error("Error fetching chat:", err);
      return null;
    }
  };
}
export const chatService = new ChatService();
