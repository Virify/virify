import { prisma } from "../../../database/server/utils/prisma-client";

/**
 * Plugin to update and hash the admin password on server start
 * The seed runs in plain-text - due to seeding before server starting
 * Admin gets assigned listings etc, so we need to update the password to a hashed version on server start
 */
export default defineNitroPlugin(async (nitroApp) => {
  const admin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });
  if (admin) {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD as string);
    if (hashedPassword !== admin.password) {
      await prisma.user.update({
        where: { email: process.env.ADMIN_EMAIL },
        data: {
          password: hashedPassword,
        },
      });
    }
  }
});
