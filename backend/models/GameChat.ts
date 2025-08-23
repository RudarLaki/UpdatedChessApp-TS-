import z from "zod";

export const GameChatSchema = z.object({
  id: z.string(),
  messageId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  message: z.string().min(1),
  sentAt: z.coerce.date(),
});

export type GameChat = z.infer<typeof GameChatSchema>;
