import * as z from "zod";

const ppdSchema = z.object({
  postcode: z.string(),
  street: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const { postcode, street } = await readValidatedBody(event, ppdSchema.parse);

    const ppdData = await findPricePaidSalesByPostcodeAndStreet({
      postcode: formatOptionalPricePaidAddressPart(postcode) ?? "",
      street: formatOptionalPricePaidAddressPart(street),
    });
    return { data: groupPricePaidSalesByAddress(ppdData) };
  } catch (error: unknown) {
    console.log("Price Paid API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to search price paid data",
    });
  }
});
