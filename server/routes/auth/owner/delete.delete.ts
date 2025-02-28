export default defineEventHandler(async (event) => {
  try {
    console.log("Deleting account...");
    // get the owner id from the session
    const session = await getUserSession(event);
    const ownerId = session.user?.id;
    // get the owner from the database
    if (ownerId) {
      await prisma.owner.delete({
        where: {
          id: ownerId,
        },
      });
      // return the owner
      return {
        status: 200,
        body: {
          message: "Account deleted successfully...",
        },
      };
    } else {
      return {
        status: 400,
        body: {
          error: "Failed! Invalid request",
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      body: {
        error: (error as Error).message,
      },
    };
  }
});
