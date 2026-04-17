import OpenAI from "openai";

const config = useRuntimeConfig();

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY as string,
});

/**
 * Checks if the required AI configuration is present.
 */
export function checkAiConfiguration() {
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI search is not configured. Please contact support.",
    });
  }
}

// ---------------------------------------------------------------------------
// SearchParameters — flat typed interface.
// GPT's ONLY job is to fill these fields from natural language.
// buildWhereClause() handles ALL Prisma nesting deterministically.
// ---------------------------------------------------------------------------
interface SearchParameters {
  // Root listing
  listingType?: "SALE" | "RENT";
  priceMin?: number;
  priceMax?: number;
  listingTier?: "BASIC" | "PREMIUM" | "FEATURED";

  // Sale listing
  tenureType?: "FREEHOLD" | "LEASEHOLD" | "COMMONHOLD";
  chain?: boolean;
  sharedOwnership?: boolean;
  priceType?: "FIXED" | "OFFERS_OVER" | "GUIDE_PRICE";
  saleAvailabilityStatus?: "AVAILABLE" | "UNDER_OFFER" | "SOLD";

  // Rental listing
  furnishedStatus?: "FURNISHED" | "UNFURNISHED" | "PART_FURNISHED";
  isBillsIncluded?: boolean;
  rentalLength?: "SHORT_TERM" | "LONG_TERM";
  rentFrequency?: "WEEKLY" | "MONTHLY";
  rentalAvailabilityStatus?: "AVAILABLE" | "LET_AGREED" | "LET";
  depositMax?: number;

  // Property
  numberBedroomsExact?: number;
  numberBedroomsMin?: number;
  numberBedroomsMax?: number;
  numberBedroomsLt?: number;
  numberBathroomsExact?: number;
  numberBathroomsMin?: number;
  numberReceptionsMin?: number;
  sizeMin?: number;
  vacant?: boolean;
  constructionType?: "STANDARD" | "NON_STANDARD";
  floorLevel?: number;
  propertyTypeName?: string;
  classificationNames?: string[];

  // Parking
  parkingFeatures?: string[];

  // Outdoor space
  hasGarden?: boolean;
  gardenFacing?: "NORTH" | "EAST" | "SOUTH" | "WEST";
  gardenPositions?: ("FRONT" | "REAR" | "SIDE")[];
  outdoorSpaceFeatures?: string[];
  landFeatures?: string[];

  // Energy & utilities
  epcRatings?: string[];
  primaryHeatingTypes?: string[];
  boilerType?: string;
  hotWaterSource?: string;
  renewables?: string[];
  connectedUtilitiesInclude?: string[];
  connectedUtilitiesExclude?: string[];
  broadbandType?: string;
  fullFibreAvailable?: boolean;
  maxDownloadSpeedMin?: number;

  // Features
  securityFeatures?: string[];
  storageFeatures?: string[];
  accessibilityFeatures?: string[];
  petFriendly?: boolean;
  buildingFeatures?: string[];

  // Rooms
  bedroomFeatures?: string[];
  bathroomFeatures?: string[];
  kitchenFeatures?: string[];
  receptionTypes?: string[];
  receptionFeatures?: string[];
  otherRoomTypes?: string[];
  utilityFeatures?: string[];

  // Amenity (single nearest amenity — most queries only ask for one)
  amenityType?: string;
  amenitySubtype?: string;
  amenityDistanceMax?: number;

  // Running costs
  councilTaxBand?: string;
  serviceChargesMax?: number;
  groundRentMax?: number;

  // Query analysis
  usedTerms?: string[];
  ignoredTerms?: string[];
}

// ---------------------------------------------------------------------------
// System prompt — very short. No Prisma knowledge needed.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are a property search assistant. Extract search parameters from the user's query by calling set_search_parameters.

ENUM VALUES — use exactly as shown:
listingType: "SALE" (for sale/to buy) | "RENT" (to rent/to let)
propertyTypeName: "House" | "Flat" | "Bungalow" | "Land" | "Commercial" | "Garage" | "Room" | "Houseboat" | "Park Home" | "Studio"
classificationNames: ["Detached"] | ["Semi-detached"] | ["Terraced"] | ["End of terrace"] | ["Mews"] | ["Listed"] | ["New build"] | ["Converted"] | ["Studio"] | ["Maisonette"] | ["Ground floor"] | ["Top floor"] | ["Penthouse"] | ["Shared"]
tenureType: "FREEHOLD" | "LEASEHOLD" | "COMMONHOLD"
priceType: "FIXED" | "OFFERS_OVER" | "GUIDE_PRICE"
saleAvailabilityStatus: "AVAILABLE" | "UNDER_OFFER" | "SOLD"
furnishedStatus: "FURNISHED" | "UNFURNISHED" | "PART_FURNISHED"
rentalLength: "SHORT_TERM" | "LONG_TERM"
rentFrequency: "WEEKLY" | "MONTHLY"
rentalAvailabilityStatus: "AVAILABLE" | "LET_AGREED" | "LET"
epcRatings: ordered A→G. "C or better" = ["A","B","C"]. "D or worse" = ["D","E","F","G"]. "B or better" = ["A","B"].
primaryHeatingTypes: "GAS_CENTRAL" | "ELECTRIC" | "OIL" | "UNDERFLOOR" | "BIOMASS" | "HEAT_PUMP" | "DISTRICT" | "STORAGE_HEATERS" | "LPG" | "PASSIVE" | "SOLAR_THERMAL" | "OTHER"
  ⚠ HEAT_PUMP → primaryHeatingTypes. NOT renewables.
boilerType: "COMBI" | "SYSTEM" | "CONVENTIONAL" | "BACK_BOILER"
hotWaterSource: "BOILER" | "IMMERSION_HEATER" | "SOLAR_THERMAL" | "HEAT_PUMP" | "OTHER"
renewables: "SOLAR_PV" | "BATTERY_STORAGE" | "SMART_METER" | "EV_CHARGING"  (only these 4)
connectedUtilitiesInclude / connectedUtilitiesExclude: "GAS" | "ELECTRICITY" | "WATER" | "SEWAGE" | "DRAINAGE" | "SEPTIC_TANK" | "CESSPIT" | "RAINWATER_HARVESTING"
  "no gas supply" → connectedUtilitiesExclude: ["GAS"]
broadbandType: "ADSL" | "FTTC" | "FTTP" | "CABLE" | "MOBILE"  ("full fibre" = "FTTP")
parkingFeatures: "GARAGE" | "DRIVEWAY" | "PERMIT_PARKING" | "ON_STREET" | "NO_PARKING" | "CARPORT" | "ALLOCATED_PARKING" | "EV_CHARGING"
hasGarden: true when user wants a garden (any garden, or with position/facing). Plain "garden" → hasGarden:true only.
"rear garden" → hasGarden:true, gardenPositions:["REAR"]. "front garden" → hasGarden:true, gardenPositions:["FRONT"]. "side garden" → hasGarden:true, gardenPositions:["SIDE"]. "front and rear garden" → hasGarden:true, gardenPositions:["FRONT","REAR"]. Multiple positions are fine.
"south facing garden" → hasGarden:true, gardenFacing:"SOUTH". "north/east/west facing garden" → hasGarden:true + gardenFacing.
gardenFacing: "NORTH" | "EAST" | "SOUTH" | "WEST"
gardenPositions: array of "FRONT" | "REAR" | "SIDE" (can be multiple)
outdoorSpaceFeatures: "SUN_TERRACE" | "TERRACE" | "BALCONY" | "PATIO" | "SEPARATE_PARCEL" | "SHED" | "SUMMER_HOUSE" | "GARDEN_OFFICE" | "POOL"
landFeatures: "WOODLAND" | "PADDOCK" | "STABLES" | "TENNIS_COURT" | "ORCHARD" | "POND" | "OUTBUILDING"
securityFeatures: "GATED_COMMUNITY" | "CCTV" | "ALARM_SYSTEM" | "NEIGHBORHOOD_WATCH" | "INTERCOM_SYSTEM" | "SECURITY" | "RECEPTION"
storageFeatures: "ATTIC" | "BASEMENT" | "SEPARATE_DRESSING" | "UNDER_STAIRS_STORAGE"
accessibilityFeatures: "WHEELCHAIR_FRIENDLY" | "STEP_FREE_ACCESS" | "WIDE_DOORWAYS" | "WET_ROOM" | "HANDRAILS" | "ELEVATOR" | "STAIRS" | "ACCESSIBLE_PARKING"
buildingFeatures: "POOL" | "INTERNET" | "CONCIERGE" | "SHOP" | "GYM"
bedroomFeatures: "EN_SUITE" | "BUILT_IN_STORAGE" | "WALK_IN_WARDROBE" | "BAY_WINDOW" | "BALCONY" | "HAS_VIEW" | "PATIO_DOORS" | "BUILT_IN_DESK"
bathroomFeatures: "TOILET" | "EN_SUITE" | "BATHTUB" | "WALK_IN_SHOWER"
kitchenFeatures: "MODERN" | "OPEN_PLAN" | "WHITE_GOODS" | "BREAKFAST_BAR" | "ISLAND" | "UTILITY_ACCESS" | "PANTRY"
receptionTypes: "LIVING_ROOM" | "FAMILY_ROOM" | "DINING_ROOM" | "GAMES_ROOM" | "HOME_CINEMA"
receptionFeatures: "OPEN_PLAN" | "OPEN_CONCEPT" | "FIREPLACE" | "BALCONY" | "BAY_WINDOW" | "BUILT_IN_SHELVING" | "HAS_VIEW" | "PATIO_DOORS" | "BUILT_IN_STORAGE" | "SERVING_HATCH" | "BAR_AREA" | "SOUND_PROOFING" | "ACCOUSTIC_PANELS" | "STONE_FLOORING" | "HARDWOOD_FLOORING" | "BUILT_IN_DESK" | "CONSERVATORY"
otherRoomTypes: "OFFICE" | "STUDY" | "LIBRARY" | "GYM" | "WORKSHOP" | "POOL_ROOM" | "WINE_CELLAR" | "SPA" | "OTHER"
utilityFeatures: "STORAGE" | "SINK" | "PLUMBING"
amenityType + amenitySubtype mappings:
  near a school       → EDUCATION + SCHOOL
  near a university   → EDUCATION + UNIVERSITY
  near a train station → TRANSPORT + TRAIN_STATION
  near a bus stop     → TRANSPORT + BUS_STOP
  near a motorway     → TRANSPORT + MOTORWAY_ACCESS
  near a hospital     → HEALTHCARE + HOSPITAL
  near a doctor/GP    → HEALTHCARE + MEDICAL_CENTRE
  near a park         → GREEN_SPACE + PARK
  near a playground   → GREEN_SPACE + PLAYGROUND
  near restaurants/bars/cinema/shops → SHOPPING_ENTERTAINMENT + (RESTAURANT|CINEMA|SHOP|GYM)

PRICE: "k" = ×1000, "m" = ×1000000. "under £400k" → priceMax:400000. "between £200k-£400k" → priceMin:200000, priceMax:400000.
BEDROOMS: "3+" or "at least 3" → numberBedroomsMin:3. "exactly 3" → numberBedroomsExact:3. "2 or 3" → numberBedroomsMin:2, numberBedroomsMax:3. "fewer than 3" → numberBedroomsLt:3.
chain: false means "chain free" / "no chain". ⚠ "chain free" or "no chain" → chain:false (NOT chain:true).

usedTerms: Short human-readable labels for every filter you set. One label per distinct concept. Examples: "For sale", "3+ bedrooms", "Under £400,000", "Detached house", "South-facing garden", "Chain free", "Furnished", "Pet friendly", "EPC C or better", "Near a school".
ignoredTerms: Parts of the query you could not map to any filter. Return [] if nothing was ignored.`;


// ---------------------------------------------------------------------------
// OpenAI tool definition — JSON Schema for SearchParameters
// ---------------------------------------------------------------------------
const SEARCH_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "set_search_parameters",
    description: "Extract all property search parameters from the user's natural language query",
    parameters: {
      type: "object",
      properties: {
        listingType: { type: "string", enum: ["SALE", "RENT"] },
        priceMin: { type: "number" },
        priceMax: { type: "number" },
        listingTier: { type: "string", enum: ["BASIC", "PREMIUM", "FEATURED"] },
        tenureType: { type: "string", enum: ["FREEHOLD", "LEASEHOLD", "COMMONHOLD"] },
        chain: { type: "boolean", description: "false = chain free / no chain. true = chain present. 'chain free' always means false." },
        sharedOwnership: { type: "boolean" },
        priceType: { type: "string", enum: ["FIXED", "OFFERS_OVER", "GUIDE_PRICE"] },
        saleAvailabilityStatus: { type: "string", enum: ["AVAILABLE", "UNDER_OFFER", "SOLD"] },
        furnishedStatus: { type: "string", enum: ["FURNISHED", "UNFURNISHED", "PART_FURNISHED"] },
        isBillsIncluded: { type: "boolean" },
        rentalLength: { type: "string", enum: ["SHORT_TERM", "LONG_TERM"] },
        rentFrequency: { type: "string", enum: ["WEEKLY", "MONTHLY"] },
        rentalAvailabilityStatus: { type: "string", enum: ["AVAILABLE", "LET_AGREED", "LET"] },
        depositMax: { type: "number" },
        numberBedroomsExact: { type: "number" },
        numberBedroomsMin: { type: "number" },
        numberBedroomsMax: { type: "number" },
        numberBedroomsLt: { type: "number" },
        numberBathroomsExact: { type: "number" },
        numberBathroomsMin: { type: "number" },
        numberReceptionsMin: { type: "number" },
        sizeMin: { type: "number" },
        vacant: { type: "boolean" },
        constructionType: { type: "string", enum: ["STANDARD", "NON_STANDARD"] },
        floorLevel: { type: "number" },
        propertyTypeName: { type: "string" },
        classificationNames: { type: "array", items: { type: "string" } },
        parkingFeatures: { type: "array", items: { type: "string", enum: ["GARAGE", "DRIVEWAY", "PERMIT_PARKING", "ON_STREET", "NO_PARKING", "CARPORT", "ALLOCATED_PARKING", "EV_CHARGING"] } },
        hasGarden: { type: "boolean" },
        gardenFacing: { type: "string", enum: ["NORTH", "EAST", "SOUTH", "WEST"] },
        gardenPositions: { type: "array", items: { type: "string", enum: ["FRONT", "REAR", "SIDE"] } },
        outdoorSpaceFeatures: { type: "array", items: { type: "string", enum: ["SUN_TERRACE", "TERRACE", "BALCONY", "PATIO", "SEPARATE_PARCEL", "SHED", "SUMMER_HOUSE", "GARDEN_OFFICE", "POOL"] } },
        landFeatures: { type: "array", items: { type: "string", enum: ["WOODLAND", "PADDOCK", "STABLES", "TENNIS_COURT", "ORCHARD", "POND", "OUTBUILDING"] } },
        epcRatings: { type: "array", items: { type: "string", enum: ["A", "B", "C", "D", "E", "F", "G"] } },
        primaryHeatingTypes: { type: "array", items: { type: "string", enum: ["GAS_CENTRAL", "ELECTRIC", "OIL", "UNDERFLOOR", "BIOMASS", "HEAT_PUMP", "DISTRICT", "STORAGE_HEATERS", "LPG", "PASSIVE", "SOLAR_THERMAL", "OTHER"] } },
        boilerType: { type: "string", enum: ["COMBI", "SYSTEM", "CONVENTIONAL", "BACK_BOILER"] },
        hotWaterSource: { type: "string", enum: ["BOILER", "IMMERSION_HEATER", "SOLAR_THERMAL", "HEAT_PUMP", "OTHER"] },
        renewables: { type: "array", items: { type: "string", enum: ["SOLAR_PV", "BATTERY_STORAGE", "SMART_METER", "EV_CHARGING"] } },
        connectedUtilitiesInclude: { type: "array", items: { type: "string", enum: ["GAS", "ELECTRICITY", "WATER", "SEWAGE", "DRAINAGE", "SEPTIC_TANK", "CESSPIT", "RAINWATER_HARVESTING"] } },
        connectedUtilitiesExclude: { type: "array", items: { type: "string", enum: ["GAS", "ELECTRICITY", "WATER", "SEWAGE", "DRAINAGE", "SEPTIC_TANK", "CESSPIT", "RAINWATER_HARVESTING"] } },
        broadbandType: { type: "string", enum: ["ADSL", "FTTC", "FTTP", "CABLE", "MOBILE"] },
        fullFibreAvailable: { type: "boolean" },
        maxDownloadSpeedMin: { type: "number" },
        securityFeatures: { type: "array", items: { type: "string", enum: ["GATED_COMMUNITY", "CCTV", "ALARM_SYSTEM", "NEIGHBORHOOD_WATCH", "INTERCOM_SYSTEM", "SECURITY", "RECEPTION"] } },
        storageFeatures: { type: "array", items: { type: "string", enum: ["ATTIC", "BASEMENT", "SEPARATE_DRESSING", "UNDER_STAIRS_STORAGE"] } },
        accessibilityFeatures: { type: "array", items: { type: "string", enum: ["WHEELCHAIR_FRIENDLY", "STEP_FREE_ACCESS", "WIDE_DOORWAYS", "WET_ROOM", "HANDRAILS", "ELEVATOR", "STAIRS", "ACCESSIBLE_PARKING"] } },
        petFriendly: { type: "boolean" },
        buildingFeatures: { type: "array", items: { type: "string", enum: ["POOL", "INTERNET", "CONCIERGE", "SHOP", "GYM"] } },
        bedroomFeatures: { type: "array", items: { type: "string", enum: ["EN_SUITE", "BUILT_IN_STORAGE", "WALK_IN_WARDROBE", "BAY_WINDOW", "BALCONY", "HAS_VIEW", "PATIO_DOORS", "BUILT_IN_DESK"] } },
        bathroomFeatures: { type: "array", items: { type: "string", enum: ["TOILET", "EN_SUITE", "BATHTUB", "WALK_IN_SHOWER"] } },
        kitchenFeatures: { type: "array", items: { type: "string", enum: ["MODERN", "OPEN_PLAN", "WHITE_GOODS", "BREAKFAST_BAR", "ISLAND", "UTILITY_ACCESS", "PANTRY"] } },
        receptionTypes: { type: "array", items: { type: "string", enum: ["LIVING_ROOM", "FAMILY_ROOM", "DINING_ROOM", "GAMES_ROOM", "HOME_CINEMA"] } },
        receptionFeatures: { type: "array", items: { type: "string", enum: ["OPEN_PLAN", "OPEN_CONCEPT", "FIREPLACE", "BALCONY", "BAY_WINDOW", "BUILT_IN_SHELVING", "HAS_VIEW", "PATIO_DOORS", "BUILT_IN_STORAGE", "SERVING_HATCH", "BAR_AREA", "SOUND_PROOFING", "ACCOUSTIC_PANELS", "STONE_FLOORING", "HARDWOOD_FLOORING", "BUILT_IN_DESK", "CONSERVATORY"] } },
        otherRoomTypes: { type: "array", items: { type: "string", enum: ["OFFICE", "STUDY", "LIBRARY", "GYM", "WORKSHOP", "POOL_ROOM", "WINE_CELLAR", "SPA", "OTHER"] } },
        utilityFeatures: { type: "array", items: { type: "string", enum: ["STORAGE", "SINK", "PLUMBING"] } },
        amenityType: { type: "string", enum: ["TRANSPORT", "EDUCATION", "HEALTHCARE", "SHOPPING_ENTERTAINMENT", "GREEN_SPACE"] },
        amenitySubtype: { type: "string", enum: ["TRAIN_STATION", "BUS_STOP", "MOTORWAY_ACCESS", "SCHOOL", "UNIVERSITY", "HOSPITAL", "MEDICAL_CENTRE", "SHOP", "RESTAURANT", "CINEMA", "GYM", "PARK", "TRAIL", "PLAYGROUND", "OTHER"] },
        amenityDistanceMax: { type: "number" },
        councilTaxBand: { type: "string" },
        serviceChargesMax: { type: "number" },
        groundRentMax: { type: "number" },
        usedTerms: { type: "array", items: { type: "string" } },
        ignoredTerms: { type: "array", items: { type: "string" } },
      },
      additionalProperties: false,
    },
  },
};

// ---------------------------------------------------------------------------
// extractSearchParameters — calls OpenAI with function calling.
// GPT fills flat SearchParameters; never sees Prisma operators.
// ---------------------------------------------------------------------------
async function extractSearchParameters(query: string): Promise<SearchParameters> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    tools: [SEARCH_TOOL],
    tool_choice: { type: "function", function: { name: "set_search_parameters" } },
    temperature: 0,
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  const args = toolCall && "function" in toolCall ? (toolCall as any).function?.arguments : undefined;
  if (!args) {
    throw createError({ statusCode: 500, statusMessage: "AI did not return search parameters." });
  }

  try {
    return JSON.parse(args) as SearchParameters;
  } catch {
    throw createError({ statusCode: 500, statusMessage: "Failed to parse AI search parameters." });
  }
}

// ---------------------------------------------------------------------------
// Enum validation — GPT-4o-mini occasionally ignores JSON schema enum constraints,
// so we filter all array params against the known-valid sets before touching Prisma.
// ---------------------------------------------------------------------------
const VALID: Record<string, Set<string>> = {
  outdoorSpaceFeatures: new Set(["SUN_TERRACE", "TERRACE", "BALCONY", "PATIO", "SEPARATE_PARCEL", "SHED", "SUMMER_HOUSE", "GARDEN_OFFICE", "POOL"]),
  landFeatures: new Set(["WOODLAND", "PADDOCK", "STABLES", "TENNIS_COURT", "ORCHARD", "POND", "OUTBUILDING"]),
  parkingFeatures: new Set(["GARAGE", "DRIVEWAY", "PERMIT_PARKING", "ON_STREET", "NO_PARKING", "CARPORT", "ALLOCATED_PARKING", "EV_CHARGING"]),
  primaryHeatingTypes: new Set(["GAS_CENTRAL", "ELECTRIC", "OIL", "UNDERFLOOR", "BIOMASS", "HEAT_PUMP", "DISTRICT", "STORAGE_HEATERS", "LPG", "PASSIVE", "SOLAR_THERMAL", "OTHER"]),
  renewables: new Set(["SOLAR_PV", "BATTERY_STORAGE", "SMART_METER", "EV_CHARGING"]),
  connectedUtilities: new Set(["GAS", "ELECTRICITY", "WATER", "SEWAGE", "DRAINAGE", "SEPTIC_TANK", "CESSPIT", "RAINWATER_HARVESTING"]),
  securityFeatures: new Set(["GATED_COMMUNITY", "CCTV", "ALARM_SYSTEM", "NEIGHBORHOOD_WATCH", "INTERCOM_SYSTEM", "SECURITY", "RECEPTION"]),
  storageFeatures: new Set(["ATTIC", "BASEMENT", "SEPARATE_DRESSING", "UNDER_STAIRS_STORAGE"]),
  accessibilityFeatures: new Set(["WHEELCHAIR_FRIENDLY", "STEP_FREE_ACCESS", "WIDE_DOORWAYS", "WET_ROOM", "HANDRAILS", "ELEVATOR", "STAIRS", "ACCESSIBLE_PARKING"]),
  buildingFeatures: new Set(["POOL", "INTERNET", "CONCIERGE", "SHOP", "GYM"]),
  bedroomFeatures: new Set(["EN_SUITE", "BUILT_IN_STORAGE", "WALK_IN_WARDROBE", "BAY_WINDOW", "BALCONY", "HAS_VIEW", "PATIO_DOORS", "BUILT_IN_DESK"]),
  bathroomFeatures: new Set(["TOILET", "EN_SUITE", "BATHTUB", "WALK_IN_SHOWER"]),
  kitchenFeatures: new Set(["MODERN", "OPEN_PLAN", "WHITE_GOODS", "BREAKFAST_BAR", "ISLAND", "UTILITY_ACCESS", "PANTRY"]),
  receptionTypes: new Set(["LIVING_ROOM", "FAMILY_ROOM", "DINING_ROOM", "GAMES_ROOM", "HOME_CINEMA"]),
  receptionFeatures: new Set(["OPEN_PLAN", "OPEN_CONCEPT", "FIREPLACE", "BALCONY", "BAY_WINDOW", "BUILT_IN_SHELVING", "HAS_VIEW", "PATIO_DOORS", "BUILT_IN_STORAGE", "SERVING_HATCH", "BAR_AREA", "SOUND_PROOFING", "ACCOUSTIC_PANELS", "STONE_FLOORING", "HARDWOOD_FLOORING", "BUILT_IN_DESK", "CONSERVATORY"]),
  otherRoomTypes: new Set(["OFFICE", "STUDY", "LIBRARY", "GYM", "WORKSHOP", "POOL_ROOM", "WINE_CELLAR", "SPA", "OTHER"]),
  utilityFeatures: new Set(["STORAGE", "SINK", "PLUMBING"]),
  epcRatings: new Set(["A", "B", "C", "D", "E", "F", "G"]),
};

function filterEnum(arr: string[] | string | undefined, key: keyof typeof VALID): string[] | undefined {
  if (!arr) return undefined;
  // GPT occasionally returns a scalar string instead of an array — normalise it
  const normalised = Array.isArray(arr) ? arr : [arr];
  if (!normalised.length) return undefined;
  const filtered = normalised.filter((v) => VALID[key].has(v));
  return filtered.length ? filtered : undefined;
}

// ---------------------------------------------------------------------------
// buildWhereClause — deterministic Prisma WHERE clause from flat parameters.
// Zero AI involvement. All nesting, operators, and enum placement is correct.
// ---------------------------------------------------------------------------
function buildWhereClause(rawParams: SearchParameters): any {
  // Strip any enum values GPT returned outside the allowed sets
  const params: SearchParameters = {
    ...rawParams,
    outdoorSpaceFeatures: filterEnum(rawParams.outdoorSpaceFeatures, "outdoorSpaceFeatures"),
    landFeatures: filterEnum(rawParams.landFeatures, "landFeatures"),
    parkingFeatures: filterEnum(rawParams.parkingFeatures, "parkingFeatures"),
    primaryHeatingTypes: filterEnum(rawParams.primaryHeatingTypes, "primaryHeatingTypes"),
    renewables: filterEnum(rawParams.renewables, "renewables"),
    connectedUtilitiesInclude: filterEnum(rawParams.connectedUtilitiesInclude, "connectedUtilities"),
    connectedUtilitiesExclude: filterEnum(rawParams.connectedUtilitiesExclude, "connectedUtilities"),
    securityFeatures: filterEnum(rawParams.securityFeatures, "securityFeatures"),
    storageFeatures: filterEnum(rawParams.storageFeatures, "storageFeatures"),
    accessibilityFeatures: filterEnum(rawParams.accessibilityFeatures, "accessibilityFeatures"),
    buildingFeatures: filterEnum(rawParams.buildingFeatures, "buildingFeatures"),
    bedroomFeatures: filterEnum(rawParams.bedroomFeatures, "bedroomFeatures"),
    bathroomFeatures: filterEnum(rawParams.bathroomFeatures, "bathroomFeatures"),
    kitchenFeatures: filterEnum(rawParams.kitchenFeatures, "kitchenFeatures"),
    receptionTypes: filterEnum(rawParams.receptionTypes, "receptionTypes"),
    receptionFeatures: filterEnum(rawParams.receptionFeatures, "receptionFeatures"),
    otherRoomTypes: filterEnum(rawParams.otherRoomTypes, "otherRoomTypes"),
    utilityFeatures: filterEnum(rawParams.utilityFeatures, "utilityFeatures"),
    epcRatings: filterEnum(rawParams.epcRatings, "epcRatings"),
  };

  const where: any = { published: true, archived: false };

  // Price
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    where.price = {};
    if (params.priceMin !== undefined) where.price.gte = params.priceMin;
    if (params.priceMax !== undefined) where.price.lte = params.priceMax;
  }

  if (params.listingTier) where.listingTier = params.listingTier;

  // Sale listing
  const saleFields: any = {};
  if (params.tenureType) saleFields.tenureType = params.tenureType;
  if (params.chain !== undefined) saleFields.chain = params.chain;
  if (params.sharedOwnership !== undefined) saleFields.sharedOwnership = params.sharedOwnership;
  if (params.priceType) saleFields.priceType = params.priceType;
  if (params.saleAvailabilityStatus) saleFields.availabilityStatus = params.saleAvailabilityStatus;

  if (params.listingType === "SALE" || Object.keys(saleFields).length > 0) {
    where.saleListing = Object.keys(saleFields).length > 0 ? { is: saleFields } : { isNot: null };
  }

  // Rental listing
  const rentalFields: any = {};
  if (params.furnishedStatus) rentalFields.furnishedStatus = params.furnishedStatus;
  if (params.isBillsIncluded !== undefined) rentalFields.isBillsIncluded = params.isBillsIncluded;
  if (params.rentalLength) rentalFields.rentalLength = params.rentalLength;
  if (params.rentFrequency) rentalFields.rentFrequency = params.rentFrequency;
  if (params.rentalAvailabilityStatus) rentalFields.availabilityStatus = params.rentalAvailabilityStatus;
  if (params.depositMax !== undefined) rentalFields.deposit = { lte: params.depositMax };

  if (params.listingType === "RENT" || Object.keys(rentalFields).length > 0) {
    where.rentalListing = Object.keys(rentalFields).length > 0 ? { is: rentalFields } : { isNot: null };
  }

  // Property
  const property: any = {};

  // Bedrooms
  if (params.numberBedroomsExact !== undefined) {
    property.numberBedrooms = params.numberBedroomsExact;
  } else if (params.numberBedroomsMin !== undefined || params.numberBedroomsMax !== undefined || params.numberBedroomsLt !== undefined) {
    property.numberBedrooms = {};
    if (params.numberBedroomsMin !== undefined) property.numberBedrooms.gte = params.numberBedroomsMin;
    if (params.numberBedroomsMax !== undefined) property.numberBedrooms.lte = params.numberBedroomsMax;
    if (params.numberBedroomsLt !== undefined) property.numberBedrooms.lt = params.numberBedroomsLt;
  }

  // Bathrooms
  if (params.numberBathroomsExact !== undefined) {
    property.numberBathrooms = params.numberBathroomsExact;
  } else if (params.numberBathroomsMin !== undefined) {
    property.numberBathrooms = { gte: params.numberBathroomsMin };
  }

  if (params.numberReceptionsMin !== undefined) property.numberReceptions = { gte: params.numberReceptionsMin };
  if (params.sizeMin !== undefined) property.size = { gte: params.sizeMin };
  if (params.vacant !== undefined) property.vacant = params.vacant;
  if (params.constructionType) property.constructionType = params.constructionType;
  if (params.floorLevel !== undefined) property.floorLevel = params.floorLevel;

  // Type & classification
  if (params.propertyTypeName) {
    property.type = { is: { name: params.propertyTypeName } };
  }
  if (params.classificationNames?.length) {
    property.classification = params.classificationNames.length === 1
      ? { is: { name: params.classificationNames[0] } }
      : { is: { name: { in: params.classificationNames } } };
  }

  // Parking
  if (params.parkingFeatures?.length) {
    property.parking = {
      is: {
        features: params.parkingFeatures.length === 1
          ? { has: params.parkingFeatures[0] }
          : { hasSome: params.parkingFeatures },
      },
    };
  }

  // Outdoor space
  const outdoorIs: any = {};
  if (params.hasGarden || params.gardenFacing || params.gardenPositions?.length) {
    if (params.gardenPositions && params.gardenPositions.length > 1) {
      // Multiple positions: property must have a garden at each position (AND)
      outdoorIs.AND = params.gardenPositions.map((pos) => ({
        garden: { some: { position: pos } },
      }));
    } else {
      const gardenFilter: any = {};
      if (params.gardenFacing) gardenFilter.facing = params.gardenFacing;
      if (params.gardenPositions?.length === 1) gardenFilter.position = params.gardenPositions[0];
      outdoorIs.garden = { some: gardenFilter };
    }
  }
  if (params.outdoorSpaceFeatures?.length) {
    outdoorIs.features = params.outdoorSpaceFeatures.length === 1
      ? { has: params.outdoorSpaceFeatures[0] }
      : { hasSome: params.outdoorSpaceFeatures };
  }
  if (params.landFeatures?.length) {
    outdoorIs.land = { some: { features: params.landFeatures.length === 1 ? { has: params.landFeatures[0] } : { hasSome: params.landFeatures } } };
  }
  if (Object.keys(outdoorIs).length > 0) property.outdoorSpace = { is: outdoorIs };

  // Energy & utilities
  const energyIs: any = {};
  if (params.epcRatings?.length) energyIs.epcRating = { in: params.epcRatings };
  if (params.primaryHeatingTypes?.length) {
    energyIs.primaryHeatingType = params.primaryHeatingTypes.length === 1
      ? { has: params.primaryHeatingTypes[0] }
      : { hasSome: params.primaryHeatingTypes };
  }
  if (params.boilerType) energyIs.boilerType = params.boilerType;
  if (params.hotWaterSource) energyIs.hotWaterSource = params.hotWaterSource;
  if (params.renewables?.length) {
    energyIs.renewables = params.renewables.length === 1
      ? { has: params.renewables[0] }
      : { hasSome: params.renewables };
  }
  if (params.connectedUtilitiesInclude?.length) {
    // Multiple must-have utilities need separate AND conditions
    if (params.connectedUtilitiesInclude.length === 1) {
      energyIs.connectedUtilities = { has: params.connectedUtilitiesInclude[0] };
    } else {
      energyIs.AND = params.connectedUtilitiesInclude.map((u) => ({ connectedUtilities: { has: u } }));
    }
  }
  if (params.broadbandType) energyIs.broadbandType = params.broadbandType;
  if (params.fullFibreAvailable !== undefined) energyIs.fullFibreAvailable = params.fullFibreAvailable;
  if (params.maxDownloadSpeedMin !== undefined) energyIs.maxDownloadSpeedMbps = { gte: params.maxDownloadSpeedMin };
  if (Object.keys(energyIs).length > 0) property.energyAndUtilities = { is: energyIs };

  // connectedUtilitiesExclude: wrap as NOT at clause level after property is built
  // (handled below after the property block)

  // Security
  if (params.securityFeatures?.length) {
    property.securityFeatures = { is: { features: params.securityFeatures.length === 1 ? { has: params.securityFeatures[0] } : { hasSome: params.securityFeatures } } };
  }

  // Storage
  if (params.storageFeatures?.length) {
    property.storageFeatures = { is: { features: params.storageFeatures.length === 1 ? { has: params.storageFeatures[0] } : { hasSome: params.storageFeatures } } };
  }

  // Accessibility
  if (params.accessibilityFeatures?.length) {
    property.accessibilityFeatures = { is: { features: params.accessibilityFeatures.length === 1 ? { has: params.accessibilityFeatures[0] } : { hasSome: params.accessibilityFeatures } } };
  }

  // Additional features (petFriendly, buildingFeatures)
  const additionalIs: any = {};
  if (params.petFriendly !== undefined) additionalIs.petFriendly = params.petFriendly;
  if (params.buildingFeatures?.length) {
    additionalIs.features = params.buildingFeatures.length === 1
      ? { has: params.buildingFeatures[0] }
      : { hasSome: params.buildingFeatures };
  }
  if (Object.keys(additionalIs).length > 0) property.additionalFeatures = { is: additionalIs };

  // Bedroom features
  if (params.bedroomFeatures?.length) {
    property.bedroomFeatures = { some: { features: params.bedroomFeatures.length === 1 ? { has: params.bedroomFeatures[0] } : { hasSome: params.bedroomFeatures } } };
  }

  // Bathroom features
  if (params.bathroomFeatures?.length) {
    property.bathroomFeatures = { some: { features: params.bathroomFeatures.length === 1 ? { has: params.bathroomFeatures[0] } : { hasSome: params.bathroomFeatures } } };
  }

  // Kitchen features
  if (params.kitchenFeatures?.length) {
    property.kitchenFeatures = { some: { features: params.kitchenFeatures.length === 1 ? { has: params.kitchenFeatures[0] } : { hasSome: params.kitchenFeatures } } };
  }

  // Reception rooms
  if (params.receptionTypes?.length || params.receptionFeatures?.length) {
    const recFilter: any = {};
    if (params.receptionTypes?.length === 1) recFilter.type = params.receptionTypes[0];
    if (params.receptionFeatures?.length) {
      recFilter.features = params.receptionFeatures.length === 1 ? { has: params.receptionFeatures[0] } : { hasSome: params.receptionFeatures };
    }
    property.reception = { some: recFilter };
  }

  // Other rooms
  if (params.otherRoomTypes?.length) {
    property.otherRoom = { some: { type: params.otherRoomTypes.length === 1 ? params.otherRoomTypes[0] : { in: params.otherRoomTypes } } };
  }

  // Amenity
  if (params.amenityType || params.amenitySubtype || params.amenityDistanceMax !== undefined) {
    const amenityFilter: any = {};
    if (params.amenityType) amenityFilter.type = params.amenityType;
    if (params.amenitySubtype) amenityFilter.subtype = params.amenitySubtype;
    if (params.amenityDistanceMax !== undefined) amenityFilter.distanceM = { lte: params.amenityDistanceMax };
    property.amenities = { some: amenityFilter };
  }

  // Running costs
  const runningIs: any = {};
  if (params.councilTaxBand) runningIs.councilTaxBand = params.councilTaxBand;
  if (params.serviceChargesMax !== undefined) runningIs.serviceCharges = { lte: params.serviceChargesMax };
  if (params.groundRentMax !== undefined) runningIs.groundRent = { lte: params.groundRentMax };
  if (Object.keys(runningIs).length > 0) property.runningCosts = { is: runningIs };

  // Utility room
  if (params.utilityFeatures?.length) {
    property.utility = { is: { features: params.utilityFeatures.length === 1 ? { has: params.utilityFeatures[0] } : { hasSome: params.utilityFeatures } } };
  }

  if (Object.keys(property).length > 0) where.property = { is: property };

  // Excluded utilities — NOT wrapper at top level
  if (params.connectedUtilitiesExclude?.length) {
    const notConditions = params.connectedUtilitiesExclude.map((u) => ({
      property: { is: { energyAndUtilities: { is: { connectedUtilities: { has: u } } } } },
    }));
    where.NOT = notConditions.length === 1 ? notConditions[0] : { AND: notConditions };
  }

  return where;
}

/**
 * Constructs the Prisma WHERE clause from the query and location filters.
 */
export async function constructPrismaWhereClause(listingType: ListingType | string | undefined, query: string, propertyIds: number[] | null) {
  const { whereClause, queryAnalysis } = await generateWhereClauseFromQuery(query);

  let typeValue: string | undefined;
  if (typeof listingType === "string") {
    typeValue = listingType;
  } else if (listingType && typeof listingType === "object" && "listingType" in listingType) {
    typeValue = (listingType as any).listingType;
  }

  // Apply listing type relation filters when provided and not 'all'
  if (typeValue && typeValue !== "all") {
    if (typeValue === "sale") {
      if (whereClause.saleListing) {
        // AI returned saleListing conditions — only wrap with `is` if they are actual field
        // conditions (e.g. { priceType: "FIXED" }). If the AI already returned a relation
        // operator like { isNot: null } or { is: { ... } }, leave it untouched: wrapping
        // { isNot: null } as { is: { isNot: null } } is invalid Prisma syntax.
        const sl = whereClause.saleListing;
        if (!sl.is && !sl.isNot) {
          whereClause.saleListing = { is: sl };
        }
      } else {
        // Otherwise require that a SaleListing relation exists
        whereClause.saleListing = { isNot: null };
      }
    } else if (typeValue === "rent") {
      if (whereClause.rentalListing) {
        const rl = whereClause.rentalListing;
        if (!rl.is && !rl.isNot) {
          whereClause.rentalListing = { is: rl };
        }
      } else {
        // Otherwise require that a RentalListing relation exists
        whereClause.rentalListing = { isNot: null };
      }
    }
  }

  if (propertyIds !== null) {
    if (propertyIds.length === 0) {
      // If no properties are in the area, we can short-circuit
      return { whereClause: { property: { is: { id: { in: [] } } } }, queryAnalysis };
    }
    
    // Ensure property exists and has the 'is' wrapper
    if (!whereClause.property) {
      whereClause.property = { is: {} };
    } else if (!whereClause.property.is) {
      // If property exists but doesn't have 'is', wrap it
      whereClause.property = { is: whereClause.property };
    }
    
    // Add the id filter inside the 'is' wrapper
    whereClause.property.is.id = { in: propertyIds };
  }

  return { whereClause, queryAnalysis };
}

/**
 * Generate a Prisma WHERE clause from a natural language query using OpenAI function calling.
 * GPT extracts flat SearchParameters; buildWhereClause() handles all nesting deterministically.
 * Results are cached for 24h. Cache key versioned — bump when SearchParameters changes.
 */
export async function generateWhereClauseFromQuery(query: string): Promise<aiSearchResult> {
  checkAiConfiguration();

  const storage = useStorage("cache");
  const cacheKey = `ai-search:${query.toLowerCase().replace(/\s+/g, " ").trim()}`;

  const cached = await storage.getItem<aiSearchResult>(cacheKey);
  if (cached) return cached;

  let result: aiSearchResult;
  try {
    const params = await extractSearchParameters(query);
    const whereClause = buildWhereClause(params);

    const queryAnalysis = {
      usedTerms: params.usedTerms ?? [],
      ignoredTerms: params.ignoredTerms ?? [],
    };

    result = { whereClause, queryAnalysis };
  } catch (error) {
    // Bust any partial/bad cache entry so the next request retries the AI call
    await storage.removeItem(cacheKey);
    throw error;
  }

  await storage.setItem(cacheKey, result, { ttl: 86400 });

  return result;
}

