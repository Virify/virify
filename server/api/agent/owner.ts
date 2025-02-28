export default defineEventHandler(async (event) => {
  const owner = await prisma.agent.findFirst({
    where: {
      owner: {
        is: {},
      },
    },
    include: {
      owner: true,
    },
  });
  return {
    statusCode: 200,
    body: owner,
  };
});
