import type { PropertyTypeWIthClassifications } from "~~/shared/types/property-type";

/**
 * 
 * @returns Promise<Array<{ id: number; name: string }>>
 */
export async function getPropertyTypes(): Promise<PropertyTypeWIthClassifications[]> {
  return await prisma.propertyType.findMany({
    select: {
      id: true,
      name: true,
      defaultSelected: true,
      classifications: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}