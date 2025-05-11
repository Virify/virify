import * as z from "zod";
import { hash } from "ohash"
import { getAllPricesCached } from "../../utils/price";

const buyOrRentSchema = z.object({
  listingType: z.enum(["buy", "rent"]),
  // @TODO support the below...
  // location: z.string().optional(),
  // propertyType: z.string().array().optional(),
  // bedrooms: z.object({
  //   min: z.number(),
  //   max: z.number(),
  // }).optional(),
  // bathrooms: z.object({
  //   min: z.number(),
  //   max: z.number(),
  // }).optional(),
});

const formatPrices = defineCachedFunction((allPrices: number[]) => {
  const GRAPH_NODE_COUNT = 15

  // Get min/max size
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)

  // Check total range between min/max
  const fullRange = maxPrice - minPrice
  const bandSize = fullRange / GRAPH_NODE_COUNT

  // Create new array
  const pricePrevelance: number[] = []

  // Create sorted copy of allPrices
  // @TODO - see below
  // --
  // const allPricesSorted = allPrices.toSorted()

  // Loop through all prices and see how many fit into each 'band'
  for (let i = minPrice; i < maxPrice; i += bandSize) {
    const bandMin = i;
    const bandMax = i + bandSize

    // Filter to all properties within a given band
    // @TODO
    // This can probably be made more efficient by doing something like
    // sorting the array and then doing a splice after each loop so we
    // are not re-checking the same prices. Once we have 1000s of
    // properties, this will become more critical. But for the PoC this
    // should not be any bottleneck at all
    const propertyCount = allPrices.filter((price) => {
      return !!(bandMax >= price && price >= bandMin)
    })

    // Add number to array
    pricePrevelance.push(propertyCount.length)
  }

  return pricePrevelance
}, {
  swr: true,
  staleMaxAge: 60 * 60 * 24, // SWR cache for 1 day
  maxAge: 60 * 60 * 24, // SWR cache for 1 day
  getKey: (allPrices) => hash(allPrices)
})

/**
 * Get all prices for rentals or sales
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { listingType } = await getValidatedQuery(event, buyOrRentSchema.parse);

    // Get all listings, but cached
    const allPrices = await getAllPricesCached(listingType)

    // Return formatted
    return formatPrices(allPrices)
  } catch (error) {
    console.error("Error fetching all prices:", error);
    return errorResponse(error, event);
  }
});
