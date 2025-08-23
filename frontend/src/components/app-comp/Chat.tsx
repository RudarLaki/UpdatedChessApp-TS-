import { useEffect, useState, type FC } from "react";
import "../../styles/Chat.css";

type ChatType = { userId: string; friendId: string; roomId: string };

import { socketService } from "../../services/socket-service";
import { chatService } from "../../services/chat-service";
import type {
  GetMessageRequest,
  SendMessageRequest,
} from "../../../../sharedGameLogic/types/game";

const Chat: FC<ChatType> = ({ userId, friendId, roomId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    {
      message: string;
      receiverId: string;
      senderId: string;
      sentAt: string;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleTime = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!friendId || !userId) return;

    const getMessages = async () => {
      try {
        const messages: GetMessageRequest[] | null = await chatService.getChat(
          userId,
          friendId
        );
        if (messages) {
          setMessages(messages); // already sorted by backend
        }
      } catch (err) {
        console.error("Failed to fetch chat:", err);
      }
    };

    getMessages();
  }, [userId, friendId]);

  useEffect(() => {
    const handleReceive = (res: GetMessageRequest) => {
      setMessages((prev) => [...prev, res]);
    };

    socketService.getMessage(handleReceive);
    return () => socketService.offChatMessage(handleReceive);
  }, [friendId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const sendMessageRequest: SendMessageRequest = {
      userId,
      friendId,
      roomId,
      message: input,
      sentAt: new Date(),
    };
    socketService.sendMessage(sendMessageRequest);

    setMessages((prev) => [
      ...prev,
      {
        message: input,
        senderId: userId,
        receiverId: friendId,
        sentAt: new Date().toISOString(),
      },
    ]);

    setInput("");
  };

  return (
    <div>
      {!open && (
        <button className="chat-toggle-btn" onClick={() => setOpen(true)}>
          <i className="fas fa-comments"></i>
        </button>
      )}

      {open && (
        <div className="chat-window">
          <i
            className="fas fa-times"
            style={{ cursor: "pointer", padding: "5px" }}
            onClick={() => setOpen(false)}
          ></i>
          <div className="chat-messages">
            {messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const isNewGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
              const isUser = msg.senderId === userId;
              const showTime = expandedId === msg.sentAt; // ← added

              return (
                <div key={msg.sentAt} className="message-group">
                  {/* Show sender label only for opponent */}
                  {!isUser && isNewGroup && (
                    <div className="sender-label">
                      {msg.senderId.substring(0, 3)}
                    </div>
                  )}

                  <div
                    className={`message-bubble ${isUser ? "sent" : "received"}`}
                    onClick={() => toggleTime(msg.sentAt)}
                  >
                    {msg.message}

                    {showTime && (
                      <div className="message-time">
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
