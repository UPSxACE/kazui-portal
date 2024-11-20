import { z } from "zod";

export type UserData = {
  address?: string | null;
  username: string;
  nickname: string;
  picture?: string | null;
};

export const userDataSchema = z.object({
  address: z.string().nullable().optional(),
  username: z.string(),
  nickname: z.string(),
  picture: z.string().nullable().optional(),
});
