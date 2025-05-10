/**
 * 
 * @param page number
 * @param pageSize number
 * @returns 
 */
export function caluclatePagination(page?: number, pageSize?: number): { skip: number; take: number } | undefined {
  if (page === undefined || pageSize === undefined) {
    return undefined;
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take };
}