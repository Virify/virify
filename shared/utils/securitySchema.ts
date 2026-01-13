import z from "zod";

const passwordComplexSchema = z.preprocess(
  (val) => val ?? "",
  z.string().superRefine((val, ctx) => {
    const issues: string[] = [];
    if (val.length < 8) issues.push("Password must be at least 8 characters");
    if (!/[A-Za-z]/.test(val)) issues.push("Must include letters");
    if (!/[0-9]/.test(val)) issues.push("Must include numbers");
    if (!/[^A-Za-z0-9]/.test(val)) issues.push("Must include special characters");

    if (issues.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: issues.join(", "),
      });
    }
  })
);

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
