import { faker } from "@faker-js/faker";

import {
  fakeOwner,
  fakeProperty,
  fakeAgent,
  fakeListing,
  fakeParking,
  fakeSecurityFeatures,
  fakeKitchenFeatures,
  fakeLivingAreaFeatures,
  fakeBathroomFeatures,
  fakeStorageFeatures,
  fakeOutdoorSpace,
  fakeAmenitiesFeature,
  fakeRunningCosts,
  fakeMedia,
  fakeBedroomFeatures,
  fakeDiningroomFeatures,
  fakeAddress,
} from "../database/prisma/fake-data";

// a basic seeder that will seed user/property/listing data
export default defineEventHandler(async (event) => {
  const userType = fakeOwner();
  const agentType = fakeAgent();
  const propertyType = fakeProperty();
  const addressType = fakeAddress();
  const parkingType = fakeParking();
  const securityFeaturesType = fakeSecurityFeatures();
  const kitchenFeaturesType = fakeKitchenFeatures();
  const livingAreaFeaturesType = fakeLivingAreaFeatures();
  const bathroomFeaturesType = fakeBathroomFeatures();
  const storageFeaturesType = fakeStorageFeatures();
  const outdoorSpaceFeaturesType = fakeOutdoorSpace();
  const amenitiesType = fakeAmenitiesFeature();
  const runningCostsType = fakeRunningCosts();
  const mediaType = fakeMedia();
  const bedroomFeaturesType = fakeBedroomFeatures();
  const diningroomType = fakeDiningroomFeatures();

  try {
    // Create owner with address
    const buildUser = await prisma.owner.create({
      data: {
        ...userType,
        properties: {
          create: {
            ...propertyType,
          },
        },
        agents: {
          create: [
            {
              firstName: undefined,
              lastName: undefined,
              email: faker.internet.email(),
              password: undefined,
              passwordResetToken: undefined,
              lastLogin: undefined,
              activationToken: undefined,
              tokenExpiry: undefined,
              properties: {
                create: {
                  ...propertyType,
                  media: {
                    create: {
                      ...mediaType,
                    },
                  },
                  address: {
                    create: {
                      ...addressType,
                    },
                  },
                  bedroomFeatures: {
                    create: [{ ...bedroomFeaturesType }, { ...bedroomFeaturesType }],
                  },
                  livingAreaFeatures: {
                    create: [{ ...livingAreaFeaturesType }, { ...livingAreaFeaturesType }],
                  },
                  bathroomFeatures: {
                    create: [{ ...bathroomFeaturesType }, { ...bathroomFeaturesType }],
                  },
                  diningroomFeatures: {
                    create: [{ ...diningroomType }, { ...diningroomType }],
                  },
                  kitchenFeatures: {
                    create: {
                      ...kitchenFeaturesType,
                    },
                  },
                  outdoorSpace: {
                    create: {
                      ...outdoorSpaceFeaturesType,
                    },
                  },
                  storageFeatures: {
                    create: {
                      ...storageFeaturesType,
                    },
                  },
                  securityFeatures: {
                    create: {
                      ...securityFeaturesType,
                    },
                  },
                  parking: {
                    create: {
                      ...parkingType,
                    },
                  },
                  runningCosts: {
                    create: {
                      ...runningCostsType,
                    },
                  },
                  amenities: {
                    create: {
                      ...amenitiesType,
                    },
                  },
                },
              },
            },
            {
              firstName: undefined,
              lastName: undefined,
              email: faker.internet.email(),
              password: undefined,
              passwordResetToken: undefined,
              lastLogin: undefined,
              activationToken: undefined,
              tokenExpiry: undefined,
              properties: {
                create: {
                  ...propertyType,
                  media: {
                    create: {
                      ...mediaType,
                    },
                  },
                  address: {
                    create: {
                      ...addressType,
                    },
                  },
                  bedroomFeatures: {
                    create: [{ ...bedroomFeaturesType }, { ...bedroomFeaturesType }],
                  },
                  livingAreaFeatures: {
                    create: [{ ...livingAreaFeaturesType }, { ...livingAreaFeaturesType }],
                  },
                  bathroomFeatures: {
                    create: [{ ...bathroomFeaturesType }, { ...bathroomFeaturesType }],
                  },
                  diningroomFeatures: {
                    create: [{ ...diningroomType }, { ...diningroomType }],
                  },
                  kitchenFeatures: {
                    create: {
                      ...kitchenFeaturesType,
                    },
                  },
                  outdoorSpace: {
                    create: {
                      ...outdoorSpaceFeaturesType,
                    },
                  },
                  storageFeatures: {
                    create: {
                      ...storageFeaturesType,
                    },
                  },
                  securityFeatures: {
                    create: {
                      ...securityFeaturesType,
                    },
                  },
                  parking: {
                    create: {
                      ...parkingType,
                    },
                  },
                  runningCosts: {
                    create: {
                      ...runningCostsType,
                    },
                  },
                  amenities: {
                    create: {
                      ...amenitiesType,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    });

    // Fetch the user with the address, properties, and listings
    const user = await prisma.owner.findUnique({
      where: { id: buildUser.id },
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
      owner: user,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating user or listing",
      error: (error as Error).message!,
    };
  }
});
