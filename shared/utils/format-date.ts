/**
 * format date to "MM/DD/YYYY"
 * 
 * @param date - Date to format
 * @returns Date in the format "MM/DD/YYYY"
 */
export const formatMDY = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date))
}