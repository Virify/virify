import { z } from "zod";
import type { Step9FormState } from "../types/step9-media";
import {
  parseFloorPlansFromMediaRecords,
  parseImageMediaFromMediaRecords,
  parseVideoTourFromMediaRecords,
} from "./step9-media-mappers";

/**
 * Step 9: Property Images Schema
 * Validates media uploads and room assignments
 */

// Media assignment schema - for assigning images to rooms
export const mediaAssignmentSchema = z.object({
  // Database primary key — present for existing images; used for reliable updates.
  id: z.number().int().positive().optional(),
  cloudflareId: z.string().min(1, "Image ID is required"),
  filename: z.string().optional(),
  description: z
    .string()
    .max(100, "Description must be 100 characters or less")
    .nullable()
    .optional(),
  // Room IDs (only one should be set, or none for general property images)
  bedroomId: z.number().int().positive().nullable().optional(),
  bathroomId: z.number().int().positive().nullable().optional(),
  kitchenId: z.number().int().positive().nullable().optional(),
  receptionId: z.number().int().positive().nullable().optional(),
  otherRoomId: z.number().int().positive().nullable().optional(),
  gardenId: z.number().int().positive().nullable().optional(),
  yardId: z.number().int().positive().nullable().optional(),
  landId: z.number().int().positive().nullable().optional(),
  outdoorSpaceId: z.number().int().positive().nullable().optional(),
  // General property image flag (no room assignment)
  isGeneral: z.boolean().optional().default(true),
});

export const floorPlanAssignmentSchema = z.object({
  id: z.number().int().positive().optional(),
  cloudflareId: z.string().min(1, "Floor plan ID is required"),
  filename: z.string().optional(),
});

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

// Property schema for Step 9
export const step9PropertySchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters",
    })
    .max(5000, {
      message: "Description cannot exceed 5000 characters",
    }),
  media: z.array(mediaAssignmentSchema).optional().default([]),
  videoTour: z
    .string()
    .trim()
    .max(2048, "Video URL cannot exceed 2048 characters")
    .optional()
    .default("")
    .refine((url) => url.length === 0 || YOUTUBE_URL_REGEX.test(url), {
      message: "Please enter a valid YouTube URL",
    }),
  floorPlans: z.array(floorPlanAssignmentSchema).optional().default([]),
});

// Step 9 form schema
export const step9Schema = z.object({
  property: step9PropertySchema,
});

/**
 * Create initial Step 9 values from existing draft data
 */
export function createInitialStep9Values(draftData?: any): Step9FormState {
  const property = draftData?.property;
  const existingMedia = property?.media || [];
  const videoTour = parseVideoTourFromMediaRecords(existingMedia);
  const media = parseImageMediaFromMediaRecords(existingMedia);
  const floorPlans = parseFloorPlansFromMediaRecords(existingMedia);

  return {
    property: {
      description: draftData?.property?.description ?? "",
      media,
      videoTour,
      floorPlans,
    },
  };
}

/**
 * Step 9 Validation Helpers
 */
export const step9Validation = {
  /**
   * Check if at least one image has been uploaded
   * Note: Images are optional, so this returns true even with 0 images
   */
  hasImages: (data: Step9FormState): boolean => {
    return data.property.media && data.property.media.length > 0;
  },

  /**
   * Check if step 9 form is valid
   * Images are optional, so step is always valid
   */
  isStep9Valid: (data: Step9FormState): boolean => {
    return !!(data.property.description && data.property.description.length >= 10);
  },

  /**
   * Check if step 9 has existing data
   */
  hasExistingStep9Data: (draftData?: any): boolean => {
    return !!(draftData?.property?.media?.length > 0);
  },
};
