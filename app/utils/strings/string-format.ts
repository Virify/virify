/**
 * Capatialise the first letter of each word in a string
 * @param str String 
 * @returns String
 */
export const capataliseWords = (str: string | null | undefined): string | null => {
  if (!str) return null;
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};