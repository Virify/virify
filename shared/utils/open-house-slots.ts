/**
 * Generate bookable slot labels for an open house session window.
 *
 * @example
 * generateSlots("10:00", "13:00", 15)
 * // → ["10:00–10:15", "10:15–10:30", ..., "12:45–13:00"]
 */
export function generateSlots(
  startTime: string,
  endTime: string,
  slotMins: number,
): string[] {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startTotal = startH! * 60 + startM!;
  const endTotal = endH! * 60 + endM!;
  const slots: string[] = [];

  for (let t = startTotal; t + slotMins <= endTotal; t += slotMins) {
    const from = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    const toT = t + slotMins;
    const to = `${String(Math.floor(toT / 60)).padStart(2, "0")}:${String(toT % 60).padStart(2, "0")}`;
    slots.push(`${from}–${to}`);
  }

  return slots;
}

/** Format an ISO date string to a short human label: "Sat 14 Jun" */
export function formatOpenHouseDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Build a slot label from a start time + slotMins duration.
 * e.g. slotLabelFromTime("10:15", 15) → "10:15–10:30"
 */
export function slotLabelFromTime(slotTime: string, slotMins: number): string {
  const [h, m] = slotTime.split(":").map(Number);
  const total = h! * 60 + m! + slotMins;
  const to = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  return `${slotTime}–${to}`;
}
