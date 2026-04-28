export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, traditionalSearchSchema.parse);

    const locationData = extractLocationForfiltering(
      body.location,
      body.radius,
    );

    let locationPropertyIds: number[] | null = null;

    if (locationData.lat && locationData.lon) {
      const { propertyIds } = await handleLocationFilter(
        locationData.lat,
        locationData.lon,
        locationData.radius,
        locationData.bbox,
        locationData.boundaryPolygon,
      );
      locationPropertyIds = propertyIds;
    }

    const params = buildTraditionalParams(body);
    const orderBy = buildListingOrderBy(body.sortBy);
    const results = await fetchTraditionalSearchListings(
      params,
      locationPropertyIds,
      orderBy,
    );

    // When a hash is already provided by the client, skip storing a new one
    if (body.hash) {
      return { results };
    }

    const hashKey = await storeSearchHash(
      body as unknown as Record<string, unknown>,
      { params, locationData, orderBy },
    );

    return { results, hashKey };
  } catch (error) {
    console.error("Traditional search error:", error);
    throw error;
  }
});
