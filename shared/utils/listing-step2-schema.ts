import { z } from "zod";

/**
 * Step 2: Property Basics Schema
 * Validates address, property type, classification, description, floors, construction type, size, and year built
 */

// Construction type values (matching Prisma enum)
const constructionTypes = ["STANDARD", "NON_STANDARD"] as const;

// Address schema for property location (allows nulls during form filling)
// Validation happens at form level to check required fields are filled
export const addressSchema = z.object({
  number: z.string().nullable(),
  flat: z.string().nullable(),
  name: z.string().nullable(),
  street: z.string().nullable(),
  city: z.string().nullable(),
  postcode: z.string().nullable(),
  country: z.string().nullable(),
  locality: z.string().nullable(),
  county: z.string().nullable(),
  district: z.string().nullable(),
  fullAddress: z.string().nullable(),
  lat: z.number().nullable(),
  lon: z.number().nullable(),
});

// Property schema
export const propertySchema = z.object({
  address: addressSchema,
  type: z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a property type",
    }),
  classification: z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a classification",
    }),
  totalFloors: z
    .number()
    .int()
    .min(1, {
      message: "Property must have at least 1 floor",
    })
    .max(100, {
      message: "Total floors cannot exceed 100",
    }),
  constructionType: z.enum(constructionTypes).nullable().optional(),
  size: z.number().positive().nullable().optional(),
  yearBuilt: z.coerce
    .number()
    .int()
    .min(1500)
    .max(new Date().getFullYear())
    .nullable()
    .optional(),
});

// Step 2 form schema
export const step2Schema = z.object({
  property: propertySchema,
  moveInDate: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return null;
    const d = val instanceof Date ? val : new Date(val as string);
    return isNaN(d.getTime()) ? null : d;
  }, z.date().nullable().optional()),
});

export type Step2FormData = z.infer<typeof step2Schema>;
export type PropertyData = z.infer<typeof propertySchema>;
export type AddressData = z.infer<typeof addressSchema>;
