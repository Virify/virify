interface AddressDetails {
  postcode: string;
  town: string;
  country: string;
  county: string;
  state: string;
  city: string;
  street: string;
  road: string;
}

interface Geometry {
  coordinates: number[]; // [longitude, latitude]
}

interface Feature {
  geometry: Geometry;
  properties: {
    address: AddressDetails;
  };
}

interface GeocodingResponse {
  features: Feature[];
}

export default defineEventHandler(async (event) => {
  const { search, distance } = await readBody(event);
  const { successResponse } = useResponse();

  try {
    // Validate the search parameter
    if (!search) throw createError({ statusCode: 400, statusMessage: "No Location" });

    // Get coordinates from the geocoding service
    const response = await getCoordinatesFromGeocodingService(search);
    console.log("Geocoding response:", response);

    // Extract coordinates and address from the response
    const { coordinates, address } = extractGeocodingResponse(response);
    console.log("Coordinates:", coordinates);
    // create the address and cache the coordinates
    await createAddressIfNotExist(address, coordinates);

    return successResponse("success");
  } catch (error) {
    console.log(error);
    throw error;
  }
});

/**
 * Calls the geocoding service to get coordinates and address details.
 *
 * @param search string
 * @returns response { features: { geometry: { coordinates: number[] }; properties: { address: { postcode: string; town: string; country: string; county: string } } }[] }
 */
async function getCoordinatesFromGeocodingService(search: string) {
  const response: GeocodingResponse = await $fetch("http://localhost:8080/search", {
    method: "get",
    query: {
      q: search,
      format: "geojson",
      addressdetails: 1,
    },
    // accept in English - this is important for the address details
    // It actually provides the address in Welsh if not specified
    headers: {
      "Accept-Language": "en",
    },
  });
  console.log("Geocoding response:", response.features[0].properties.address);
  return response;
}

/**
 *  Extracts coordinates and address from the geocoding response.
 *
 * @param response { features: { geometry: { coordinates: number[] }; properties: { address: { postcode: string; town: string; country: string; county: string } } }[] }
 * @returns Object
 */
function extractGeocodingResponse(response: GeocodingResponse) {
  const coordinates = response.features[0].geometry.coordinates;
  const address = response.features[0].properties.address;

  return { coordinates, address };
}

/**
 * Creates a new address in the database if it doesn't already exist.
 * Updates the location field with coordinates if provided.
 *
 * @param address { postcode: string; town: string; country: string; county: string }
 * @param coordinates number[]
 * @returns Address
 */
async function createAddressIfNotExist(address: AddressDetails, coordinates: number[]) {
  // Check if the address already exists in the database
  const existingAddress = await prisma.address.findUnique({
    where: {
      street_city_postcode_country: {
        street: address.road ?? null,
        city: address.town ?? address.city ?? null,
        postcode: address.postcode ?? null,
        country: address.state ?? null,
      },
    },
  });

  // If the address exists, throw an error
  if (existingAddress) {
    throw createError({ statusCode: 400, statusMessage: "Address already exists" });
  }

  // If the address doesn't exist, create a new one
  const newAddress = await prisma.address.create({
    data: {
      city: address.town ?? address.city ?? null,
      postcode: address.postcode ?? null,
      county: address.county ?? null,
      country: address.state ?? null,
      street: address.road ?? null,
      number: null,
    },
  });

  // If coordinates are provided, update the location field
  if (coordinates) {
    await prisma.$executeRawUnsafe(
      `
      UPDATE "Address"
      SET "location" = ST_SetSRID(ST_MakePoint($1, $2), 4326)
      WHERE id = $3
    `,
      coordinates[0],
      coordinates[1],
      newAddress.id
    );
  }

  return newAddress;
}
