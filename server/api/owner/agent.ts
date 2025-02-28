export default defineEventHandler(async (event) => {
  const owner = await prisma.owner.findFirst({
    where: {
      agents: {
          some: {}
      },
    },
    include: {
      agents: true,
    },
  });
  return {
    statusCode: 200,
    body: owner,
  }
});