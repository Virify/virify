import * as z from "zod";

const postcodeSchema = z.object({
  postcode: z
    .string()
    .trim()
    .toUpperCase()
    .transform((str) => str.replace(/\s/g, ''))
    .pipe(z.string().min(3).max(8))
});

export default defineEventHandler(async (event) => {
  const { easyPostcodeAPI } = useRuntimeConfig()
  const { postcode } = await getValidatedQuery(event, postcodeSchema.parse)

  /**
   *  Get storage, with set base to avoid conflicts
   */
  const storage = await useStorage('postcodes')

  /**
   *  Allow fetching postcodes from storage
   */
  const cacheHit = await storage.getItem(postcode)

  if (cacheHit) {
    console.log(`Returning addresses for '${postcode}' from cache`)

    return cacheHit
  }

  /**
   *  Ensure a valid API key exists
   */
  if (typeof easyPostcodeAPI !== 'string') {
    throw new TypeError('No API key supplied for postcode service')
  }

  /**
   *  Fetch postcode from easypostcodes
   */
  console.log(`Fetching new addresses for '${postcode}'`)

  return await $fetch(`https://api.easypostcodes.com/addresses/${postcode}?includeGeo=true`, {
    headers: { 'Key': easyPostcodeAPI },
  }).then(async (response) => {
    const responseString = JSON.stringify(response)

    await storage.setItem(postcode, responseString)

    console.log(`Fetched and saved new addresses for '${postcode}'`)

    return response
  }).catch((err) => {
    console.error(err)

    throw createError({
      status: 500,
      statusMessage: `Unable to fetch addresses for '${postcode}'`
    })
  })
});
