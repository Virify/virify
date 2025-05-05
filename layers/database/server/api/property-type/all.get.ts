import type { PropertyType } from "@prisma/client";

/**
 * Get All Property Types
 * @param event
 * @returns Array of property types
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const propertyTypes: PropertyType[] = await getPropertyTypes();
    return propertyTypes;
  } catch (error) {
    errorResponse(error, event);
  }
}
);