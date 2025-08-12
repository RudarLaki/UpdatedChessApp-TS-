import z from "zod";

export const GameChatSchema = z.object({
  chatId: z.string(),
  roomId: z.string(),
  senderId: z.string(),
  message: z.string().min(1),
  sentAt: z.string().datetime(),
});

export type GameChat = z.infer<typeof GameChatSchema>;
