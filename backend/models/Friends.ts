import z from "zod";

export const FriendsSchema = z.object({
  userId: z.string(),
  friendId: z.string(),
  status: z.string(),
  sentAt: z.coerce.date(),
});

export type Friends = z.infer<typeof FriendsSchema>;
