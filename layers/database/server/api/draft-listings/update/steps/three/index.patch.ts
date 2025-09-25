import * as z from "zod";

const stepDataSchema = z.object({
  draftId: z.number().int().positive(),
  price: z.number().positive(),
  rentalListing: z
    .object({
      deposit: z.number().positive().nullable().optional(),
      holdingDeposit: z.number().positive().nullable().optional(),
      rentFrequency: z.enum(["WEEKLY", "MONTHLY"]).nullable().optional(),
      rentalLength: z.number().int().positive().nullable().optional(),
    })
    .optional(),
  saleListing: z
    .object({
      priceType: z.enum(["FIXED", "OFFERS_OVER", "GUIDE_PRICE"]).nullable().optional(),
    })
    .optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { draftId, price, rentalListing, saleListing } = await readValidatedBody(event, stepDataSchema.parse);

    const updatedDraftListing = await prisma.draftListing.update({
      where: { id: draftId },
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
    console.log("Error updating draft listing:", error);
    return errorResponse(error, event);
  }
});
