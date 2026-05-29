/** An open house session created by the listing owner — a timed window with bookable 15-min slots */
export interface OpenHouseSession {
  id: number;
  listingId: number;
  /** ISO string for the session date (stored as UTC noon) */
  date: string;
  /** "HH:mm" start of the viewing window */
  startTime: string;
  /** "HH:mm" end of the viewing window */
  endTime: string;
  /** Duration of each bookable slot in minutes — default 15 */
  slotMins: number;
  createdAt: string;
  updatedAt: string;
  /** Slot labels already booked — e.g. ["10:00–10:15", "10:30–10:45"] */
  bookedSlots: string[];
}

/** Payload to create a new open house session */
export interface CreateOpenHouseSessionPayload {
  listingId: number;
  /** YYYY-MM-DD */
  date: string;
  /** "HH:mm" */
  startTime: string;
  /** "HH:mm" */
  endTime: string;
  slotMins?: number;
}

/** Payload to book a slot within an open house session */
export interface BookOpenHouseSlotPayload {
  /** "HH:mm" — start of the chosen slot */
  slotTime: string;
  conversationId?: number;
}
