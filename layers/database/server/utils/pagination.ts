/**
 * 
 * @param page numer
 * @param pageSize number
 * @returns 
 */
export function caluclatePagination(page: number, pageSize: number): { skip: number; take: number } {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take };
}