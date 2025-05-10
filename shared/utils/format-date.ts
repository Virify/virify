/**
 * format date to "MM/DD/YYYY"
 * 
 * @param date - Date to format
 * @returns Date in the format "MM/DD/YYYY"
 */
export const formatMDY = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date))
}

/**
 * Converts a number of days (as a string) into a date.
 * @param days String representing the number of days ago
 * @returns A Date object
 */
export function calculateDateFromDays(days: string): Date {
  const daysAsNumber = parseInt(days, 10);
  if (isNaN(daysAsNumber)) {
    throw createError("Invalid input: days must be a valid number in string format.");
  }
  const today = new Date();
  today.setDate(today.getDate() - daysAsNumber);
  return today;
}

/**
 * convery a date into days
 * 
 * @param date Date
 * @returns Date in Days
 */
export const dateAddedToDays = (date: Date): number => {
  const dateAdded = new Date(date);
  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - dateAdded.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};