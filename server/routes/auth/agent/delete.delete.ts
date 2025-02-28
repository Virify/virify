export default defineEventHandler(async (event) => {
  // TODO: Refactor
  try {
    console.log("Deleting account...");
    // get the owner id from the session
    const session = await getUserSession(event);
    const agentId = session.user?.id;
    // get the owner OR the agent
    const agent = await prisma.owner.findFirst({
      include: {
        agents: {
          where: {
            id: agentId,
          },
        },
      },
    });
    if (agent) {
      await prisma.owner.delete({
        where: {
          id: agent.id,
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
