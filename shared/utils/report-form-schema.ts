import { z } from "zod";

export const reportSchema = z.object({
  email: z.email("Invalid email address"),
  type: z
    .enum([
      "inappropriate-content",
      "incorrect-information",
      "inaccurate-listing",
      "other",
    ])
    .refine((val) => val.length > 0, "Please select a issue type"),
  details: z.string().min(1, "Details are required"),
  listingId: z.number().optional(),
  conversationId: z.number().optional(),
  messageId: z.number().optional(),
  message: z.string().optional(),
  userId: z.number().optional(),
});
