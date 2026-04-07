import z from "zod";
import { passwordComplexSchema } from "./password-schema";

export const profileCreateSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string("Must be a valid username").min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters"),
    newPassword: passwordComplexSchema,
    confirmNewPassword: z.preprocess((val) => val ?? "", z.string())
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

  export const profileCreateUsernameSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string("Must be a valid username").min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters"),
  });

export type ProfileCreateSchemaType = z.infer<typeof profileCreateSchema>;
export type ProfileCreateUsernameSchemaType = z.infer<typeof profileCreateUsernameSchema>;