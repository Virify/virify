/**
 * Step 9: Property Images - Type Definitions
 * Types for media uploads and room assignments
 */

import type { Ref } from "vue";

/** Media assignment for property images */
export interface MediaAssignment {
  /** Database primary key — set after upload or on load. Used for reliable updates. */
  id?: number;
  cloudflareId: string;
  filename?: string;
  description?: string | null;
  // Room IDs (only one should be set, or none for general property images)
  bedroomId?: number | null;
  bathroomId?: number | null;
  kitchenId?: number | null;
  receptionId?: number | null;
  otherRoomId?: number | null;
  gardenId?: number | null;
  yardId?: number | null;
  landId?: number | null;
  outdoorSpaceId?: number | null;
  // General property image flag (no room assignment)
  isGeneral?: boolean;
}

/** Floor plan media assignment (stored separately from property photos) */
export interface FloorPlanAssignment {
  id?: number;
  cloudflareId: string;
  filename?: string;
}

/** Step 9 property data */
export interface Step9PropertyData {
  description: string;
  media: MediaAssignment[];
  videoTour: string;
  floorPlans: FloorPlanAssignment[];
}

/** Step 9 form data (API submission) */
export interface Step9FormData {
  property: Step9PropertyData;
}

/** Step 9 form state (matches reactive state in component) */
export interface Step9FormState {
  property: {
    description: string;
    media: MediaAssignment[];
    videoTour: string;
    floorPlans: FloorPlanAssignment[];
  };
}

/** Options for useStep9Media composable */
export interface UseStep9MediaOptions {
  draftListingId: Ref<number | null | undefined>;
  editingListingId?: Ref<number | null | undefined>;
  media: MediaAssignment[];
  maxImages: Ref<number>;
  listingTier: Ref<string>;
}
