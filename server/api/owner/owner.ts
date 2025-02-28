export default defineEventHandler(async (event) => {
  const owner = await prisma.owner.findFirst();
  return {
    statusCode: 200,
    body: owner,
  }
});