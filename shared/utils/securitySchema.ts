import z from "zod";
import { passwordComplexSchema } from "./password-schema";

export const securitySchema = z
  .object({
    email: z.union([z.email("Must be a valid email"), z.literal("")]).optional().nullable(),
    currentPassword: passwordComplexSchema,
    newPassword: passwordComplexSchema,
    confirmNewPassword: z.preprocess((val) => val ?? "", z.string())
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export const securitySchemaSetPassword = z
  .object({
    email: z.union([z.email("Must be a valid email"), z.literal("")]).optional().nullable(),
    newPassword: passwordComplexSchema,
    confirmNewPassword: z.preprocess((val) => val ?? "", z.string())
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const securitySchemaBase = z.object({
  email: z.union([z.email("Must be a valid email"), z.literal("")]).optional().nullable(),
  currentPassword: z.string().nullable().optional(),
  newPassword: z.string().nullable().optional(),
  confirmNewPassword: z.string().nullable().optional(),
});

export type SecuritySchemaType = z.infer<typeof securitySchema>;
export type SecuritySchemaBaseType = z.infer<typeof securitySchemaBase>;
export type SecuritySchemaSetPasswordType = z.infer<typeof securitySchemaSetPassword>;
