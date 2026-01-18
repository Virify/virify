/**
 * Step 9: Property Images - Type Definitions
 * Types for media uploads and room assignments
 */

/** Media assignment for property images */
export interface MediaAssignment {
  cloudflareId: string
  filename?: string
  description?: string | null
  // Room IDs (only one should be set, or none for general property images)
  bedroomId?: number | null
  bathroomId?: number | null
  kitchenId?: number | null
  receptionId?: number | null
  otherRoomId?: number | null
  gardenId?: number | null
  yardId?: number | null
  landId?: number | null
  outdoorSpaceId?: number | null
  // General property image flag (no room assignment)
  isGeneral?: boolean
}

/** Step 9 property data */
export interface Step9PropertyData {
  media: MediaAssignment[]
}

/** Step 9 form data (API submission) */
export interface Step9FormData {
  property: Step9PropertyData
}

/** Step 9 form state (matches reactive state in component) */
export interface Step9FormState {
  property: {
    media: MediaAssignment[]
  }
}

/** Options for useStep9Media composable */
export interface UseStep9MediaOptions {
  draftListingId: Ref<number | null | undefined>
  media: MediaAssignment[]
  maxImages: Ref<number>
  listingTier: Ref<string>
}
