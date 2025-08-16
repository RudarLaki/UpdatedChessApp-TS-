import z from "zod";

export const GameChatSchema = z.object({
  chatId: z.string(),
  roomId: z.string(),
  senderId: z.string(),
  message: z.string().min(1),
  sentAt: z.coerce.date(),
});

export type GameChat = z.infer<typeof GameChatSchema>;
