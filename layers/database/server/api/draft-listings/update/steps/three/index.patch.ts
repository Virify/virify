import * as z from "zod";
import { RentalPriceType, SalePriceType } from "~~/layers/database/server/database/prisma/generated/enums";

const stepDataSchema = z.object({
  draftId: z.number().int().positive(),
  price: z.number().positive(),
  rentalListing: z
    .object({
  deposit: z.number().min(0).nullable().optional(),
  holdingDeposit: z.number().min(0).nullable().optional(),
      rentFrequency: z.enum(Object.values(RentalPriceType)).nullable().optional(),
      rentalLength: z.enum(["SHORT_TERM", "LONG_TERM"]).nullable().optional(),
    })
    .optional(),
  saleListing: z
    .object({
      priceType: z.enum(Object.values(SalePriceType)).nullable().optional(),
    })
    .optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    const { draftId, price, rentalListing, saleListing } = await readValidatedBody(event, stepDataSchema.parse);

    const updatedDraftListing = await prisma.draftListing.update({
      where: { id: draftId, userId: user.id },
      data: {
        price: price,
        rentalListing: rentalListing
          ? {
              update: {
                ...rentalListing,
              },
            }
          : undefined,
        saleListing: saleListing
          ? {
              update: {
                ...saleListing,
              },
            }
          : undefined,
      },
      include: {
        saleListing: true,
        rentalListing: true,
      },
    });

    return updatedDraftListing;
  } catch (error) {
    return errorResponse(error, event);
  }
});
