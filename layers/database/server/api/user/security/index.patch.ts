/** PATCH /api/user/security — Update user email and password. Uses `schema` query: "base" | "full" | "set-password`. */
import * as z from "zod";
/** Zod schema validating query parameter `schema` ("full" | "base" | "set-password") */
import type { H3Event } from "h3";

const schemaParam = z.object({
  schema: z.enum(["full", "base", "set-password"]).default("base"),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  // get the schema depending on if password change is requested
  const { schema } = await getValidatedQuery(event, schemaParam.parse);
  const body = await readValidatedBody(event, (data) => selectSchema(schema).parse(data));

  // Fetch user record
  const userRecord = await getUserWithVerificationAndMembershipById(user.id);

  if (!userRecord) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  // Handle setting initial password
  if (schema === "set-password") {
    await handleSetPassword(event, userRecord, body as z.output<typeof securitySchemaSetPassword>);
    return { success: true };
  }

  // Handle password change if requested
  if (schema === "full") {
    await handlePasswordChange(userRecord, body as z.output<typeof securitySchema>);
    return { success: true };
  }

  // Handle email update only
  await handleEmailUpdate(userRecord, body as { email?: string | null });
  return { success: true };
});

/**
 * Set initial password and activate the user.
 * @param event - H3 event for the request
 * @param userRecord - Existing user record from the database
 * @param body - Parsed request body for setting a password
 */
async function handleSetPassword(event: H3Event, userRecord: any, body: z.output<typeof securitySchemaSetPassword>) {
  if (userRecord.password) {
    throw createError({ statusCode: 400, statusMessage: "Password already set" });
  }
  if (body.newPassword) {
    const hashedNewPassword = await hashPassword(body.newPassword);
    const updatedUser = await updateUserSecurityById(userRecord.id, body.email ?? undefined, hashedNewPassword, 'ACTIVATED');
    // Refresh session to reflect password set
    await loginUser(event, updatedUser);
  }
}

/**
 * Change an existing password after verifying the current one.
 * @param userRecord - Existing user record from the database
 * @param body - Parsed request body for password change
 */
async function handlePasswordChange(userRecord: any, body: z.output<typeof securitySchema>) {
  if (body.currentPassword && body.newPassword && body.confirmNewPassword) {
    // validate new password is different from current password
    if (body.currentPassword === body.newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "New password must be different from current password",
      });
    }

    // verify current password
    // we can safely assert password because we are in the full schema flow which implies existing password
    if (!userRecord.password) {
        throw createError({ statusCode: 400, statusMessage: "No password set for this user" });
    }
    
    const isValidPassword = await verifyPassword(userRecord.password, body.currentPassword);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await hashPassword(body.newPassword);
    await updateUserSecurityById(userRecord.id, body.email ?? undefined, hashedNewPassword);
  }
}

/**
 * Update the user's email if it has changed.
 * @param userRecord - Existing user record from the database
 * @param body - Parsed request body for email update
 */
async function handleEmailUpdate(userRecord: any, body: { email?: string | null }) {
  if (body.email && body.email !== userRecord.email) {
    await updateUserSecurityById(userRecord.id, body.email, undefined);
  }
}

/**
 * Return the Zod validation schema for the requested `schema` name.
 * @param schema - Which validation schema to use
 * @returns Zod schema to use for parsing/validation
 */
function selectSchema(schema: "full" | "base" | "set-password") {
  if (schema === "set-password") return securitySchemaSetPassword;
  return schema === "full" ? securitySchema : securitySchemaBase;
}
