import { z } from "zod";
import { UserData, userDataSchema } from "./user-data";

export type PostData = {
  id: number;
  created_at: string;
  text?: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  images: { path: string }[];
  owner: UserData;
};

export const postDataSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  text: z.string().nullable().optional(),
  views_count: z.number(),
  likes_count: z.number(),
  comments_count: z.number(),
  images: z.object({ path: z.string() }).array(),
  owner: userDataSchema,
});