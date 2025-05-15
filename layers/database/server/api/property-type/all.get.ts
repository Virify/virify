/**
 * Get All Property Types
 * @param event
 * @returns Array of property types
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const propertyTypes = await getPropertyTypes()

    return propertyTypes.map((({ classifications = [], ...type }) => {
      return {
        ...type,
        options: classifications.map(({ name }) => name)
      }
    }))
  } catch (error) {
    errorResponse(error, event);
  }
}
);