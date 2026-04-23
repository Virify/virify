import * as z from "zod";

export const ragSearchSchema = z.object({
  type: z.enum(["traditional", "ai"]).default("traditional"),
  listingType: z.enum(["sale", "rent", "all"]).optional().default("all"),
  query: z.string().min(1, "Query is required"),
  location: z
    .object({
      geometry: z
        .object({
          coordinates: z.tuple([z.number(), z.number()]),
        })
        .optional(),
      boundaryPolygon: z
        .object({
          type: z.enum(["Polygon", "MultiPolygon"]),
          coordinates: z.union([
            z.array(z.array(z.array(z.number()))),
            z.array(z.array(z.array(z.array(z.number())))),
          ]),
        })
        .optional(),
      bbox: z
        .tuple([z.number(), z.number(), z.number(), z.number()])
        .optional(),
    })
    .passthrough()
    .optional(),
  radius: z.coerce.number().optional().default(40),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  sortBy: z
    .enum(["relevance", "price-asc", "price-desc", "date-desc", "date-asc"])
    .optional()
    .default("relevance"),
  hash: z.string().optional(),
});
