import type { Prisma, PropertyType } from "~~/layers/database/server/database/prisma/generated/client"
import type { ConstructionType } from "~~/layers/database/server/database/prisma/generated/enums";
import type { RentalListingCreateWithoutListingInput, SaleListingCreateWithoutListingInput } from "~~/layers/database/server/database/prisma/generated/models";

export type StepOne = {
  rentalListing?: RentalListingCreateWithoutListingInput
  saleListing?: SaleListingCreateWithoutListingInput
}

export type StepTwo = {
  property: {
    type: number | null
    classification: number | null
    constructionType: ConstructionType | null
    yearBuilt: string | null
    size: number | null
    description: string | null
  }
}

export type DraftListingWithFullPayload = Prisma.DraftListingGetPayload<{
  include: {
    rentalListing: true,
    saleListing: true,
    property: {
      include: {
        address: true,
        media: true,
        type: true,
        classification: true,
        bedroomFeatures: {
          include: {
            media: true,
          },
        },
        bathroomFeatures: {
          include: {
            media: true,
          },
        },
        otherRoom: {
          include: {
            media: true,
          },
        },
        parking: true,
        amenities: true,
        additionalFeatures: true,
        accessibilityFeatures: true,
        kitchenFeatures: {
          include: {
            media: true,
          },
        },
        reception: {
          include: {
            media: true,
          },
        },
        utility: true,
        rearGarden: {
          include: {
            media: true,
          },
        },
        frontGarden: {
          include: {
            media: true,
          },
        },
        energyAndUtilities: true,
        securityFeatures: true,
        storageFeatures: true,
        runningCosts: true,
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    },
  },
}>;