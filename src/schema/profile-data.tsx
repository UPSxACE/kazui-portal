import { z } from "zod";

export type ProfileData =
  | {
      rubies: number;
      username: string;
      nickname: string;
      picture: string;
      created_at: string;
    }
  | false; // false means account needs to be created

export const profileDataSchema = z.literal(false).or(
  z.object({
    rubies: z.number(),
    username: z.string(),
    nickname: z.string(),
    picture: z.string(),
    created_at: z.string(),
  })
);
