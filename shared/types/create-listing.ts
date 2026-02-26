export type TierOption = {
  tier: "premium" | "featured" | "basic";
  price: number;
  rank: number;
};

export interface CreateListingStep {
  id: number
  title: string
  content: string
  slot: string
  value: string
  completed: boolean
  locked: boolean
  icon: string
}

/**
 * Step 9: Property Images Types
 */

/**
 * Room type for available rooms structure
 */
export interface Step9Room {
  id: number
  name: string
  roomNumber?: number
  type?: string
}

/**
 * Available rooms for image assignment
 */
export interface AvailableRooms {
  bedrooms: Step9Room[]
  bathrooms: Step9Room[]
  kitchens: Step9Room[]
  receptions: Step9Room[]
  otherRooms: Step9Room[]
  gardens: Step9Room[]
  yards: Step9Room[]
  lands: Step9Room[]
}

/**
 * Room option for select dropdown
 */
export interface RoomOption {
  value: string
  label: string
}