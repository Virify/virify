export default defineEventHandler(async (event) => {
  const owner = await prisma.agent.findFirst();
  return {
    statusCode: 200,
    body: owner,
  }
});