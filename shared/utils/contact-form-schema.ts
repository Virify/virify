import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Valid email is required"),
  telephone: z.string().optional(),
  enquiry: z.string().min(10, "Enquiry must be at least 10 characters"),
});
