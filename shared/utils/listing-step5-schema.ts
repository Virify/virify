import { z } from 'zod'
import { OtherRoomType, ReceptionType, KitchenFeature, RoomFeature } from '~~/layers/database/server/database/prisma/generated/enums'

/**
 * Step 5: Kitchens, Receptions & Other Rooms Schema
 * Validates kitchen features, reception rooms, and other rooms
 */

// Kitchen enum values
const kitchenFeatureValues = Object.values(KitchenFeature) as [string, ...string[]]
const receptionTypeValues = Object.values(ReceptionType) as [string, ...string[]]
const otherRoomTypeValues = Object.values(OtherRoomType) as [string, ...string[]]
const roomFeatureValues = Object.values(RoomFeature) as [string, ...string[]]

// Kitchen schema - matches Prisma model
export const kitchenSchema = z.object({
  name: z.string().min(1, 'Kitchen name is required').max(100, 'Kitchen name must be 100 characters or less'),
  roomNumber: z.coerce.number().int().min(1),
  description: z.string().max(500).nullable().optional(),
  floor: z.coerce.number().int().min(1, 'Floor is required'),
  features: z.array(z.enum(kitchenFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0).nullable().optional(),
})

// Reception schema - matches Prisma model
export const receptionSchema = z.object({
  name: z.string().min(1, 'Reception name is required').max(100, 'Reception name must be 100 characters or less'),
  roomNumber: z.coerce.number().int().min(1),
  description: z.string().max(500).nullable().optional(),
  floor: z.coerce.number().int().min(1, 'Floor is required'),
  type: z.enum(receptionTypeValues, { message: 'Please select a reception type' }),
  features: z.array(z.enum(roomFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0).nullable().optional(),
})

// Other room schema - matches Prisma model
export const otherRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(100, 'Room name must be 100 characters or less'),
  roomNumber: z.coerce.number().int().min(1),
  description: z.string().max(500).nullable().optional(),
  floor: z.coerce.number().int().min(1, 'Floor is required'),
  type: z.enum(otherRoomTypeValues, { message: 'Please select a room type' }),
  features: z.array(z.enum(roomFeatureValues)).optional().default([]),
  size: z.coerce.number().min(0).nullable().optional(),
})

// Property schema for Step 5
export const step5PropertySchema = z.object({
  totalFloors: z.coerce.number().int().min(1),
  kitchenFeatures: z.array(kitchenSchema).default([]),
  numberKitchens: z.coerce.number().int().min(0).default(0),
  reception: z.array(receptionSchema).default([]),
  numberReceptions: z.coerce.number().int().min(0).default(0),
  otherRoom: z.array(otherRoomSchema).default([]),
  numberOtherRooms: z.coerce.number().int().min(0).default(0),
})

// Step 5 form schema
export const step5Schema = z.object({
  property: step5PropertySchema,
})

// Types
export type KitchenData = z.infer<typeof kitchenSchema>
export type ReceptionData = z.infer<typeof receptionSchema>
export type OtherRoomData = z.infer<typeof otherRoomSchema>
export type Step5PropertyData = z.infer<typeof step5PropertySchema>
export type Step5FormData = z.infer<typeof step5Schema>

/**
 * Create initial Step 5 values from existing draft data
 */
export function createInitialStep5Values(draftData?: any): Step5FormData {
  return {
    property: {
      totalFloors: draftData?.property?.totalFloors ?? 1,
      kitchenFeatures: draftData?.property?.kitchenFeatures?.map((k: any) => ({
        name: k.name ?? '',
        roomNumber: k.roomNumber ?? 1,
        description: k.description ?? null,
        floor: k.floor ?? 1,
        size: k.size ?? null,
        features: k.features ?? [],
      })) ?? [],
      numberKitchens: draftData?.property?.numberKitchens ?? 0,
      reception: draftData?.property?.reception?.map((r: any) => ({
        name: r.name ?? '',
        roomNumber: r.roomNumber ?? 1,
        description: r.description ?? null,
        floor: r.floor ?? 1,
        size: r.size ?? null,
        type: r.type,
        features: r.features ?? [],
      })) ?? [],
      numberReceptions: draftData?.property?.numberReceptions ?? 0,
      otherRoom: draftData?.property?.otherRoom?.map((o: any) => ({
        name: o.name ?? '',
        roomNumber: o.roomNumber ?? 1,
        description: o.description ?? null,
        floor: o.floor ?? 1,
        size: o.size ?? null,
        type: o.type,
        features: o.features ?? [],
      })) ?? [],
      numberOtherRooms: draftData?.property?.numberOtherRooms ?? 0,
    }
  }
}

/**
 * Validation helpers for Step 5
 */
export const step5Validation = {
  /**
   * Check if step 5 data is valid
   * Note: All rooms are optional, so step is always valid
   */
  isStep5Valid: (): boolean => {
    return true // Step 5 is optional
  },

  /**
   * Check if step 5 has any data
   */
  hasStep5Data: (data: Step5FormData): boolean => {
    return (
      data.property.kitchenFeatures.length > 0 ||
      data.property.reception.length > 0 ||
      data.property.otherRoom.length > 0
    )
  },
}
