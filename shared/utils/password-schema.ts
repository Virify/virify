import z from "zod";

export const passwordComplexSchema = z.preprocess(
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