import { z } from 'zod'

export const supportSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  subject: z.enum(["bug", "issue", "feature", "other"]).refine(val => val.length > 0, 'Please select a subject'),
  details: z.string().min(1, 'Details are required'),
});