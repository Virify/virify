import type { PropertyType } from "@prisma/client";

/**
 * 
 * @returns Promise<Array<{ id: number; name: string }>>
 */
export async function getPropertyTypes(): Promise<PropertyType[]> {
  return await prisma.propertyType.findMany();
}