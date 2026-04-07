import z from "zod";
import { UserIntent } from "~~/layers/database/server/database/prisma/generated/enums";
import { ukPhoneRegex } from "./regex";


export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Must be a valid email").optional(),
  address: z.object({
    number: z.string().nullable(),
    flat: z.string().nullable(),
    name: z.string().nullable(),
    street: z.string(),
    city: z.string(),
    locality: z.string().nullable(),
    district: z.string().nullable(),
    county: z.string().nullable(),
    country: z.string().nullable(),
    postcode: z.string(),
    fullAddress: z.string().nullable(),
    lat: z.number().nullable(),
    lon: z.number().nullable(),
  }).optional(),
  avatar: z.url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  intents: z.array(z.nativeEnum(UserIntent)).optional(),
  interests: z.array(z.string()).optional(),
  phoneNumber: z.union([z.literal(""), z.string().trim().regex(ukPhoneRegex, 'Invalid phone number')]).optional(),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;