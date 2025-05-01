import { FurnishingStatus, Tenure, BedSizeType } from "@prisma/client";
import type { Property, Prisma } from "@prisma/client";
import { updateLocationByAddressId, getLocationByAddressId } from "../../utils/location";

export default defineEventHandler(async (event) => {
  try {
    // Address
    const address: Prisma.AddressCreateWithoutPropertiesInput = {
      street: "Llantrisant Road",
      city: "Pontypridd",
      postcode: "CF371LN",
    };

    // Bedrooms
    const bedrooms: Prisma.BedroomCreateWithoutPropertyInput[] = [
      {
        roomNumber: 1,
        bed: [BedSizeType.SUPER_KING],
        description: "This is a single bedroom",
        enSuite: true,
        builtInStorage: true,
      },
      {
        roomNumber: 2,
        bed: [BedSizeType.SINGLE],
        description: "This is a singe bedroom",
      },
      {
        roomNumber: 3,
        bed: [BedSizeType.DOUBLE],
        description: "This is a double bedroom",
        builtInStorage: true,
      },
    ];

    // Bathrooms
    const bathrooms: Prisma.BathroomCreateWithoutPropertyInput[] = [
      {
        roomNumber: 1,
        enSuite: true,
        description: "This is a ensuite bathroom",
        upstairs: true,
        bathtub: true,
      },
      {
        roomNumber: 2,
        description: "This is a downstarirs bathroom",
        downstairs: true,
        upstairs: false,
        bathtub: false,
      },
    ];

    // Parking
    const parking: Prisma.ParkingCreateWithoutPropertyInput = {
      description: "This is parking with EV charging and a garage",
      garage: true,
      driveway: true,
      evCharging: true,
    };

    // Create a new property with minimum required fields
    const property: Property = await prisma.property.create({
      data: {
        title: "New Property",
        description: "This is a new property",
        value: 100000,
        furnishingStatus: FurnishingStatus.FURNISHED,
        tenure: Tenure.FREEHOLD,
        type: {
          connect: {
            id: 1, // House
          },
        },
        classification: {
          connect: {
            id: 2, // Semi-Detached
          },
        },
        address: {
          create: {
            ...address,
          },
        },
        bedroomFeatures: {
          create: [...bedrooms],
        },
        bathroomFeatures: {
          create: [...bathrooms],
        },
        parking: {
          create: {
            ...parking,
          },
        },
        media: {
          create: [
            {
              image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
              metadata: "Description of the image",
            },
            {
              image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
              metadata: "Description of the image",
            },
            {
              image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
              metadata: "Description of the image",
            },
          ],
        },
      },
      include: {
        address: true,
        bedroomFeatures: true,
        media: true,
        parking: true,
        type: true,
        classification: true,
      },
    });

    const updateLocation = await updateLocationByAddressId(property.addressId, -3.347182, 51.594768);
    const location = await getLocationByAddressId(property.addressId);

    return {
      propertyId: property.id,
      property,
      bedrooms: bedrooms.length,
      bathrooms: bathrooms.length,
      location,
    };
  } catch (error) {
    console.log(error);
  }
});
