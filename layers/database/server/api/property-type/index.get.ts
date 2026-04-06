/**
 * Get All Property Types
 * @param event
 * @returns Array of property types
 *
 * Cached for 24 hours — property types are reference data that only
 * changes on a schema migration, so a long-lived server-side cache is safe.
 */
export default defineCachedEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const propertyTypes = await getPropertyTypes()

    return propertyTypes.map((({ classifications = [], ...type }) => {
      return {
        ...type,
        options: classifications.map(({ id, name }) => ({
          key: id,
          value: name
        }))
      }
    }))
  } catch (error) {
    errorResponse(error, event);
  }
}, {
  maxAge: 60 * 60 * 24, // 24 hours
  name: 'property-types',
});