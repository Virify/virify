import { FurnishingStatus, Tenure, type Address } from "@prisma/client";
export default defineEventHandler(async (event) => {
  try {
    const address = {
      street: "Llantrisant Road",
      city: "Pontypridd",
      postcode: "CF371LN",
    };

    // const additionalFeatures = {
    //   description: "Additional features",
    //   moveInDate: new Date(),
    // }

    const minimumProperty = await prisma.property.create({
      data: {
        title: "New Property",
        description: "This is a new property",
        value: 100000,
        furnishingStatus: FurnishingStatus.FURNISHED,
        tenure: Tenure.FREEHOLD,
        type: {
          connect: {
            id: 1, // house
          },
        },
        address: {
          create: {
            ...address,
          },
        },
        media: {
          create: {
            image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            metadata: "Description of the image",
          },
        },
      },
      include: {
        address: true,
        media: true,
        type: {
          include: {
            classifications: true,
          }
        }
      }
    });
    
    return {
      minimumProperty,
    }
  } catch (error) {
    console.log(error);
  }
});
