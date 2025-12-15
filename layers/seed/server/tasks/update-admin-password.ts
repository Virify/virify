/**
 * Task to update the admin password to a hashed version
 * 
 * This is needed as password is seeded plain-text - this task is ran by update-admin-password endpooint
 */
export default defineTask({
  meta: {
    name: "update-admin-password",
    description: "Updates the admin password to a hashed version",
  },
  async run() {
    try {
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
      return { 
        result: "success",
      };
    } catch (error) {
      return {
        result: "error",
        error: (error as Error).message,
      };
    }
  },
});
