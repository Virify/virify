export default defineEventHandler(async (event) => {
  const {id} = getQuery(event);
  const dbAgent = await prisma.agent.findUnique({
    where: {
      id: Number(id),
    },
  });
  return {
    status: 200,
    body: {
      agent: dbAgent,
    },
  }
});