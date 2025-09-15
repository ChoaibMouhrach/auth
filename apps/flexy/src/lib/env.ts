import { z } from "zod";

const schema = z.object({
  // SERVER
  SERVER_CLIENT_URL: z.url(),
  FLEXY_CLIENT_ID: z.uuid(),
  FLEXY_REDIRECT_URL: z.url(),
});

export const env = schema.parse(process.env);
