import * as z from "zod";

const postcodeSchema = z.object({
  postcode: z
    .string()
    .trim()
    .toUpperCase()
    .transform((str) => str.replace(/\s/g, ''))
    .pipe(z.string().min(4).max(8))
});

export default defineEventHandler(async (event) => {
  const { easyPostcodeAPI } = useRuntimeConfig()
  const { postcode } = await getValidatedQuery(event, postcodeSchema.parse)

  console.log('Formatted postcode', postcode)

  /**
   *  Get storage, with set base to avoid conflicts
   */
  const storage = await useStorage('postcodes')

  /**
   *  Allow fetching postcodes from storage
   */
  const cacheHit = await storage.getItem(postcode)

  if (cacheHit && typeof cacheHit === 'string') {
    console.log('Returning postcode from cache')

    return JSON.parse(cacheHit)
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
  console.log('Fetching new postcode')

  return await $fetch(`https://api.easypostcodes.com/addresses/${postcode}?includeGeo=true`, {
    headers: { 'Key': easyPostcodeAPI },
  }).then(async (response) => {
    const responseString = JSON.stringify(response)

    await storage.setItem(postcode, responseString)

    console.log('Fetched and saved new postcode')

    return response
  }).catch((err) => {
    console.error(err)

    throw new TypeError('Unable to fetch postcode')
  })
});
