export default defineEventHandler(async (event) => {
  const property = await prisma.property.findFirst({
    where: {
      owner: {
        isNot: null
      }
    },
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
      owner: {
        include: {
          agents: true,
        },
      },
    },
  });
  return {
    statusCode: 200,
    body: property,
  }
});