export default defineEventHandler(async (event) => {
  const owner = await prisma.owner.findFirst({
    where: {
      properties: {
        some: {}
      }
    },
    include: {
      properties: true,
      agents: {
        include: {
          properties: {
            include: {
              media: true,
              address: true,
              livingAreaFeatures: true,
              bathroomFeatures: true,
              kitchenFeatures: true,
              bedroomFeatures: true,
              diningroomFeatures: true,
              outdoorSpace: true,
              storageFeatures: true,
              securityFeatures: true,
              parking: true,
              runningCosts: true,
              amenities: true,
            },
          },
        },
      },
      listings: true,
    },
  });
  return {
    statusCode: 200,
    body: owner,
  }
});