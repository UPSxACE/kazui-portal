import { z } from "zod";

export type SelfProfileData =
  | {
      rubies: number;
      username: string;
      nickname: string;
      picture: string;
    }
  | false; // false means account needs to be created

export const selfProfileDataSchema = z.literal(false).or(
  z.object({
    rubies: z.number(),
    username: z.string(),
    nickname: z.string(),
    picture: z.string(),
  })
);
