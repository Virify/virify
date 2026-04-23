import type OpenAI from "openai";

// ---------------------------------------------------------------------------
// System prompt — very short. No Prisma knowledge needed.
// ---------------------------------------------------------------------------

/** System prompt sent on every AI search request. Instructs GPT to populate `SearchParameters` via function calling. */
export const SYSTEM_PROMPT = `You are a property search assistant. Extract search parameters from the user's query by calling set_search_parameters.

⚠ REQUIRED: You MUST always populate usedTerms with a short human-readable label for EVERY filter you set. One label per distinct concept. Examples: "For sale", "To rent", "House", "Flat", "Cottage", "Bungalow", "Land", "Farm", "Student accommodation", "3+ bedrooms", "Under £400,000", "Detached house", "Semi-detached house", "Terraced house", "South-facing garden", "Chain free", "Furnished", "Pet friendly", "EPC C or better", "Near a school", "Cardiff", "Leasehold", "New build", "Garage", "Garden", "2 bathrooms". If you set propertyTypeName, you MUST add the property type as a usedTerm (e.g. "House", "Flat", "Cottage"). If you set ANY parameter, you MUST add a corresponding usedTerm. Never return an empty usedTerms array if any filters were set.

ENUM VALUES — use exactly as shown:
listingType: "SALE" (for sale/to buy) | "RENT" (to rent/to let)
propertyTypeName: "House" | "Cottage" | "Bungalow" | "Flat" | "Land" | "Farms" | "Specialty" | "Student Accommodation"
classificationNames — use ONLY these values, matched to the propertyTypeName:
  House / Cottage / Bungalow → "Terraced" | "Detached" | "Semi-detached" | "End of Terrace" | "Mansion" (Mansion is House only)
  Flat → "Converted" | "Studio" | "Maisonette" | "High-rise" | "Within a Complex" | "Penthouse"
  Land → "Residential" | "Commercial" | "Agricultural" | "Development Plot" | "Development Potential"
  Farms → "Non-working" | "Working" | "Small Holding"
  Specialty → "Retirement Home" | "New Build Home"
  Student Accommodation → "Flat" | "House" | "House-share"
Examples: "house" → propertyTypeName:"House". "houses" → propertyTypeName:"House". "house for sale" → propertyTypeName:"House", listingType:"SALE". "houses for sale" → propertyTypeName:"House", listingType:"SALE". "house to rent" → propertyTypeName:"House", listingType:"RENT". "flat" → propertyTypeName:"Flat". "flats" → propertyTypeName:"Flat". "flat for sale" → propertyTypeName:"Flat", listingType:"SALE". "cottage" → propertyTypeName:"Cottage". "cottages" → propertyTypeName:"Cottage". "bungalow" → propertyTypeName:"Bungalow". "bungalows" → propertyTypeName:"Bungalow". "land for sale" → propertyTypeName:"Land", listingType:"SALE". "detached house" → propertyTypeName:"House", classificationNames:["Detached"]. "semi detached house" → propertyTypeName:"House", classificationNames:["Semi-detached"]. "terraced house" → propertyTypeName:"House", classificationNames:["Terraced"]. "end of terrace" → propertyTypeName:"House", classificationNames:["End of Terrace"]. "retirement property" → propertyTypeName:"Specialty", classificationNames:["Retirement Home"]. "new build" → propertyTypeName:"Specialty", classificationNames:["New Build Home"]. "farm" → propertyTypeName:"Farms". "student let" → propertyTypeName:"Student Accommodation". "maisonette" → propertyTypeName:"Flat", classificationNames:["Maisonette"]. "penthouse" → propertyTypeName:"Flat", classificationNames:["Penthouse"]. "high rise flat" → propertyTypeName:"Flat", classificationNames:["High-rise"].
tenureTypes: array of "FREEHOLD" | "LEASEHOLD" | "COMMONHOLD". "freehold" → ["FREEHOLD"]. "freehold or commonhold" → ["FREEHOLD","COMMONHOLD"]. "no leasehold" / "not leasehold" → ["FREEHOLD","COMMONHOLD"]. "leasehold" → ["LEASEHOLD"]. "commonhold" → ["COMMONHOLD"].
priceType: "FIXED" | "OFFERS_OVER" | "GUIDE_PRICE"
saleAvailabilityStatuses: array of "AVAILABLE" | "UNDER_OFFER" | "SOLD". "available" → ["AVAILABLE"]. "available or under offer" → ["AVAILABLE","UNDER_OFFER"].
furnishedStatuses: array of "FURNISHED" | "UNFURNISHED" | "PART_FURNISHED". "furnished" → ["FURNISHED"]. "furnished or part furnished" → ["FURNISHED","PART_FURNISHED"]. "unfurnished" → ["UNFURNISHED"].
rentalLength: "SHORT_TERM" | "LONG_TERM"
rentFrequency: "WEEKLY" | "MONTHLY"  (payment frequency — "weekly rent" → WEEKLY, "monthly rent" → MONTHLY)
rentalAvailabilityStatuses: array of "AVAILABLE" | "LET_AGREED" | "LET". "available" → ["AVAILABLE"]. "available or let agreed" → ["AVAILABLE","LET_AGREED"].
isBillsIncluded: true when bills/utilities are included in the rent. "bills included" → isBillsIncluded:true. "all bills included" → isBillsIncluded:true.
epcRatings: ordered A→G. "C or better" = ["A","B","C"]. "D or worse" = ["D","E","F","G"]. "B or better" = ["A","B"].
primaryHeatingTypes: "GAS_CENTRAL" | "ELECTRIC" | "OIL" | "UNDERFLOOR" | "BIOMASS" | "HEAT_PUMP" | "DISTRICT" | "STORAGE_HEATERS" | "LPG" | "PASSIVE" | "SOLAR_THERMAL" | "OTHER"
  ⚠ HEAT_PUMP → primaryHeatingTypes. NOT renewables.
boilerType: "COMBI" | "SYSTEM" | "CONVENTIONAL" | "BACK_BOILER"
hotWaterSource: "BOILER" | "IMMERSION_HEATER" | "SOLAR_THERMAL" | "HEAT_PUMP" | "OTHER"
renewables: "SOLAR_PV" | "BATTERY_STORAGE" | "SMART_METER" | "EV_CHARGING"  (only these 4)
connectedUtilitiesInclude / connectedUtilitiesExclude: "GAS" | "ELECTRICITY" | "WATER" | "SEWAGE" | "DRAINAGE" | "SEPTIC_TANK" | "CESSPIT" | "RAINWATER_HARVESTING"
  "no gas supply" → connectedUtilitiesExclude: ["GAS"]
broadbandType: "ADSL" | "FTTC" | "FTTP" | "CABLE" | "MOBILE"  (currently connected to full fibre = "FTTP")
fullFibreAvailable: true when full fibre is available at the property regardless of current connection type. "full fibre available" → fullFibreAvailable:true. Do NOT set broadbandType for this alone.
maxDownloadSpeedMin: Min broadband download speed in Mbps. "100Mbps+" → maxDownloadSpeedMin:100. "superfast" → maxDownloadSpeedMin:24. "ultrafast" → maxDownloadSpeedMin:100. "gigabit" → maxDownloadSpeedMin:1000.
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
petFriendly: true when pets are allowed, false when explicitly not allowed. "pets allowed" → petFriendly:true. "dog friendly" → petFriendly:true. "no pets" → petFriendly:false.
buildingFeatures: "POOL" | "INTERNET" | "CONCIERGE" | "SHOP" | "GYM"
bedroomFeatures: "EN_SUITE" | "BUILT_IN_STORAGE" | "WALK_IN_WARDROBE" | "BAY_WINDOW" | "BALCONY" | "HAS_VIEW" | "PATIO_DOORS" | "BUILT_IN_DESK"
  ⚠ Room feature assignment rules:
  - When a feature is explicitly tied to a bedroom → bedroomFeatures ONLY. "cottage with a bedroom with a bay window" → bedroomFeatures:["BAY_WINDOW"]. "en-suite bedroom" → bedroomFeatures:["EN_SUITE"].
  - When a feature is explicitly tied to a reception/living room → receptionFeatures ONLY. "living room with bay windows" → receptionFeatures:["BAY_WINDOW"].
  - When NO specific room is mentioned and the feature can appear in multiple room types → set it in ALL applicable arrays. "house with bay windows" → bedroomFeatures:["BAY_WINDOW"], receptionFeatures:["BAY_WINDOW"]. "property with a view" → bedroomFeatures:["HAS_VIEW"], receptionFeatures:["HAS_VIEW"]. This makes the search return properties that have the feature anywhere, which matches user intent.
bathroomFeatures: "TOILET" | "EN_SUITE" | "BATHTUB" | "WALK_IN_SHOWER"
kitchenFeatures: "MODERN" | "OPEN_PLAN" | "WHITE_GOODS" | "BREAKFAST_BAR" | "ISLAND" | "UTILITY_ACCESS" | "PANTRY"
receptionTypes: "LIVING_ROOM" | "FAMILY_ROOM" | "DINING_ROOM" | "GAMES_ROOM" | "HOME_CINEMA". ALWAYS set when the user mentions specific named rooms — even if they sound like a generic description. "with a living room" → receptionTypes:["LIVING_ROOM"]. "living room and dining room" / "with a living room and a dining room" → receptionTypes:["LIVING_ROOM","DINING_ROOM"]. "family room" → receptionTypes:["FAMILY_ROOM"]. "home cinema" → receptionTypes:["HOME_CINEMA"].
receptionFeatures: "OPEN_PLAN" | "OPEN_CONCEPT" | "FIREPLACE" | "BALCONY" | "BAY_WINDOW" | "BUILT_IN_SHELVING" | "HAS_VIEW" | "PATIO_DOORS" | "BUILT_IN_STORAGE" | "SERVING_HATCH" | "BAR_AREA" | "SOUND_PROOFING" | "ACCOUSTIC_PANELS" | "STONE_FLOORING" | "HARDWOOD_FLOORING" | "BUILT_IN_DESK" | "CONSERVATORY"
otherRoomTypes: "OFFICE" | "STUDY" | "LIBRARY" | "GYM" | "WORKSHOP" | "POOL_ROOM" | "WINE_CELLAR" | "SPA" | "OTHER"
otherRoomFeatures: Same enum as receptionFeatures (RoomFeature). "home office with a view" → otherRoomTypes:["OFFICE"], otherRoomFeatures:["HAS_VIEW"]. "gym with hardwood floors" → otherRoomTypes:["GYM"], otherRoomFeatures:["HARDWOOD_FLOORING"].
otherRoomSizeMin: Min size of a single other room in m². "large home office" → otherRoomSizeMin:12. "big study" → otherRoomSizeMin:10.
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
  near a trail/footpath → GREEN_SPACE + TRAIL
  near a playground   → GREEN_SPACE + PLAYGROUND
  near restaurants/bars/cinema/shops → SHOPPING_ENTERTAINMENT + (RESTAURANT|CINEMA|SHOP|GYM)
amenityDistanceMax: Distance in metres. "within 500m" → 500. "walking distance" → 800. "nearby" → 1000. "close to" → 1500.

PRICE: "k" = ×1000, "m" = ×1000000. "under £400k" → priceMax:400000. "between £200k-£400k" → priceMin:200000, priceMax:400000.
sizeMin: Min total property floor area in m². Use your judgement to convert any size description (explicit measurements, or vague terms like "small", "large", "spacious") into a reasonable m² threshold. "1000 sq ft" → sizeMin:93. "100m²" → sizeMin:100.
vacant: true for vacant possession or empty properties. "vacant possession" → vacant:true. "empty property" → vacant:true.
BEDROOMS: A plain number ("4 bedroom", "a 3 bed") → numberBedroomsExact. Only use Min/Max when the user explicitly signals a range or open-ended request. "3+" or "at least 3" or "3 or more" → numberBedroomsMin:3. "exactly 3" → numberBedroomsExact:3. "2 or 3" or "2-3 bedrooms" → numberBedroomsMin:2, numberBedroomsMax:3. "fewer than 3" or "up to 3" → numberBedroomsLt:3. "4 bedroom house" → numberBedroomsExact:4. "3 bed flat" → numberBedroomsExact:3.
chain: false means "chain free" / "no chain". ⚠ "chain free" or "no chain" → chain:false (NOT chain:true). chain is on the SaleListing relation only.
sharedOwnership: true for shared ownership schemes. "shared ownership" → sharedOwnership:true. "50% share" → sharedOwnership:true.
moveInDateBefore: ISO date string (YYYY-MM-DD). Property available ON OR BEFORE this date. Use for "move in next month", "available by June", "available within 3 months", "available soon". Compute from today's date. "next month" → last day of next month. "within 3 months" → today + 3 months.
moveInDateAfter: ISO date string (YYYY-MM-DD). Property available FROM this date. Use for "available from September", "available after the summer". Compute from today's date.
listingTier: "BASIC" | "PREMIUM" | "FEATURED". Only set when explicitly requested. "featured listings" → listingTier:"FEATURED". "premium listings" → listingTier:"PREMIUM".

yearBuiltAfter / yearBuiltBefore: 4-digit year (number). "built after 2000" → yearBuiltAfter:2000. "Victorian" → yearBuiltBefore:1910. "Edwardian" → yearBuiltAfter:1901, yearBuiltBefore:1910. "1970s" → yearBuiltAfter:1970, yearBuiltBefore:1979. "new build" → use classificationNames instead.
FLOOR NUMBERING: 0 = Ground Floor, 1 = First Floor, 2 = Second Floor, etc. A "2 storey" or "2 floor" house has totalFloors=2 (ground + first).
floorLevel: Floor a room is on. "ground floor flat" → floorLevel:0. "first floor flat" → floorLevel:1. "second floor flat" → floorLevel:2.
totalFloorsMax: Max number of floors in the building (count, not index). "2 storey" / "2 floor" → totalFloorsMax:2. "single storey" / "bungalow" → totalFloorsMax:1. "low-rise" → totalFloorsMax:4. "no high-rise" → totalFloorsMax:6.
numberReceptionsExact / numberReceptionsMin: A plain count ("2 reception rooms", "1 reception") → numberReceptionsExact:2. "at least 2 receptions" / "2+ reception rooms" → numberReceptionsMin:2. "open plan living and dining" → receptionTypes, not this.
numberKitchensExact / numberKitchensMin: A plain count ("2 kitchens") → numberKitchensExact:2. "at least 2 kitchens" → numberKitchensMin:2.
numberOtherRoomsExact / numberOtherRoomsMin: A plain count ("2 home offices", "3 other rooms") → numberOtherRoomsExact. "at least 2 studies" → numberOtherRoomsMin:2.
depositMax: Max security deposit in pounds (rental only). "deposit under £2,000" → depositMax:2000.
holdingDepositMax: Max holding deposit in pounds (rental only). "holding deposit under £500" → holdingDepositMax:500.
secondaryHeatingTypes: Same enum as primaryHeatingTypes. "log burner" → secondaryHeatingTypes:["OTHER"]. "electric backup" → secondaryHeatingTypes:["ELECTRIC"].
bedSizes: "SINGLE" | "DOUBLE" | "QUEEN" | "KING" | "SUPER_KING". "king size bed" → bedSizes:["KING"]. "double bed" → bedSizes:["DOUBLE"]. "single bed" → bedSizes:["SINGLE"].
gardenSizeMin: Min garden size in m². "large garden" → gardenSizeMin:50. "50m² garden" → gardenSizeMin:50.
outdoorAreaMin: Min total outdoor area in m² across all outdoor spaces.
landSizeMin: Min land plot size in m². "acre of land" → landSizeMin:4047. "paddock" → landSizeMin:2000.
landSeparateParcel: true when land is on a separate title from the main property. "separate parcel of land" → landSeparateParcel:true.
hasYard: true when user mentions a yard, courtyard, or paved outdoor area. Apply same facing/position rules as garden using yardFacing/yardPositions.
yardFacing / yardPositions: Same enums as gardenFacing / gardenPositions.
yardSizeMin: Min yard size in m².
BATHROOMS: A plain number ("2 bathrooms", "a 3 bathroom house") → numberBathroomsExact. Only use Min/Max when the user explicitly signals a range or open-ended request. "2+ bathrooms" or "at least 2" → numberBathroomsMin:2. "exactly 2" → numberBathroomsExact:2. "at most 2" → numberBathroomsMax:2. "fewer than 2" → numberBathroomsLt:2. "2 bathroom house" → numberBathroomsExact:2.
bedroomSizeMin: Min size of an individual bedroom in m². "large bedroom" → bedroomSizeMin:12. "master bedroom" → bedroomSizeMin:15.
bathroomSizeMin: Min size of an individual bathroom in m².
kitchenSizeMin: Min size of an individual kitchen in m². "large kitchen" → kitchenSizeMin:15. "kitchen bigger than 20m²" / "kitchen over 20 square metres" / "20sqm kitchen" → kitchenSizeMin:20. Always use the explicit value when a measurement is given.
receptionSizeMin: Min size of an individual reception room in m². "large living room" → receptionSizeMin:20.
councilTaxBand: UK council tax band — "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H". "council tax band D" → councilTaxBand:"D". Only set if the user specifies an exact band.
serviceChargesMax: Max monthly service charge in pounds (leasehold/flats). "service charge under £200/month" → serviceChargesMax:200.
groundRentMax: Max annual ground rent in pounds. "ground rent under £500/year" → groundRentMax:500.

usedTerms: Short human-readable labels for every filter you set. One label per distinct concept. Examples: "For sale", "3+ bedrooms", "Under £400,000", "Detached house", "South-facing garden", "Chain free", "Furnished", "Pet friendly", "EPC C or better", "Near a school".
ignoredTerms: Parts of the query you could not map to any filter. Return [] if nothing was ignored.

sellerUsername: Exact username of the seller. "listings by john.doe" → sellerUsername:"john.doe". "properties from @jane_smith" → sellerUsername:"jane_smith". Strip any @ prefix. Only set when a specific username is referenced — never set for vague terms like "private seller" or "estate agent".

⛔ NOT SUPPORTED — always add to ignoredTerms, never attempt to filter by:
- Neighbourhood names, street names, postcode sectors — use location context passed separately
- School catchment areas — no catchment data available`;

// ---------------------------------------------------------------------------
// OpenAI tool definition — JSON Schema for SearchParameters
// ---------------------------------------------------------------------------
export const SEARCH_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "set_search_parameters",
    description:
      "Extract all property search parameters from the user's natural language query",
    parameters: {
      type: "object",
      properties: {
        listingType: { type: "string", enum: ["SALE", "RENT"] },
        priceMin: { type: "number" },
        priceMax: { type: "number" },
        listingTier: { type: "string", enum: ["BASIC", "PREMIUM", "FEATURED"] },
        tenureTypes: {
          type: "array",
          items: {
            type: "string",
            enum: ["FREEHOLD", "LEASEHOLD", "COMMONHOLD"],
          },
        },
        chain: {
          type: "boolean",
          description:
            "false = chain free / no chain. true = chain present. 'chain free' always means false.",
        },
        sharedOwnership: { type: "boolean" },
        priceType: {
          type: "string",
          enum: ["FIXED", "OFFERS_OVER", "GUIDE_PRICE"],
        },
        saleAvailabilityStatuses: {
          type: "array",
          items: { type: "string", enum: ["AVAILABLE", "UNDER_OFFER", "SOLD"] },
        },
        furnishedStatuses: {
          type: "array",
          items: {
            type: "string",
            enum: ["FURNISHED", "UNFURNISHED", "PART_FURNISHED"],
          },
        },
        isBillsIncluded: { type: "boolean" },
        rentalLength: { type: "string", enum: ["SHORT_TERM", "LONG_TERM"] },
        rentFrequency: { type: "string", enum: ["WEEKLY", "MONTHLY"] },
        rentalAvailabilityStatuses: {
          type: "array",
          items: { type: "string", enum: ["AVAILABLE", "LET_AGREED", "LET"] },
        },
        depositMax: { type: "number" },
        holdingDepositMax: { type: "number" },
        numberBedroomsExact: { type: "number" },
        numberBedroomsMin: { type: "number" },
        numberBedroomsMax: { type: "number" },
        numberBedroomsLt: { type: "number" },
        numberBathroomsExact: { type: "number" },
        numberBathroomsMin: { type: "number" },
        numberBathroomsMax: { type: "number" },
        numberBathroomsLt: { type: "number" },
        numberReceptionsExact: { type: "number" },
        numberReceptionsMin: { type: "number" },
        sizeMin: { type: "number" },
        yearBuiltAfter: { type: "number", description: "4-digit year" },
        yearBuiltBefore: { type: "number", description: "4-digit year" },
        totalFloorsMax: {
          type: "number",
          description:
            "Max number of floors in the building (count, not index). '2 storey'/'2 floor' → 2. 'single storey'/'bungalow' → 1. 'low-rise' → 4.",
        },
        numberKitchensExact: { type: "number" },
        numberKitchensMin: { type: "number" },
        numberOtherRoomsExact: { type: "number" },
        numberOtherRoomsMin: { type: "number" },
        vacant: { type: "boolean" },
        constructionType: {
          type: "string",
          enum: ["STANDARD", "NON_STANDARD"],
        },
        floorLevel: {
          type: "number",
          description:
            "Floor level using 0-based convention: 0=Ground Floor, 1=First Floor, 2=Second Floor, etc. 'ground floor flat' → 0. 'first floor flat' → 1.",
        },
        propertyTypeName: {
          type: "string",
          enum: [
            "House",
            "Cottage",
            "Bungalow",
            "Flat",
            "Land",
            "Farms",
            "Specialty",
            "Student Accommodation",
          ],
        },
        classificationNames: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "Terraced",
              "Detached",
              "Semi-detached",
              "End of Terrace",
              "Mansion",
              "Converted",
              "Studio",
              "Maisonette",
              "High-rise",
              "Within a Complex",
              "Penthouse",
              "Residential",
              "Commercial",
              "Agricultural",
              "Development Plot",
              "Development Potential",
              "Non-working",
              "Working",
              "Small Holding",
              "Retirement Home",
              "New Build Home",
              "Flat",
              "House",
              "House-share",
            ],
          },
        },
        parkingFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GARAGE",
              "DRIVEWAY",
              "PERMIT_PARKING",
              "ON_STREET",
              "NO_PARKING",
              "CARPORT",
              "ALLOCATED_PARKING",
              "EV_CHARGING",
            ],
          },
        },
        hasGarden: { type: "boolean" },
        gardenFacing: {
          type: "string",
          enum: ["NORTH", "EAST", "SOUTH", "WEST"],
        },
        gardenPositions: {
          type: "array",
          items: { type: "string", enum: ["FRONT", "REAR", "SIDE"] },
        },
        gardenSizeMin: { type: "number", description: "Min garden size in m²" },
        outdoorAreaMin: {
          type: "number",
          description: "Min total outdoor area in m²",
        },
        landSizeMin: { type: "number", description: "Min land size in m²" },
        landSeparateParcel: { type: "boolean" },
        outdoorSpaceFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "SUN_TERRACE",
              "TERRACE",
              "BALCONY",
              "PATIO",
              "SEPARATE_PARCEL",
              "SHED",
              "SUMMER_HOUSE",
              "GARDEN_OFFICE",
              "POOL",
            ],
          },
        },
        landFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "WOODLAND",
              "PADDOCK",
              "STABLES",
              "TENNIS_COURT",
              "ORCHARD",
              "POND",
              "OUTBUILDING",
            ],
          },
        },
        hasYard: { type: "boolean" },
        yardFacing: {
          type: "string",
          enum: ["NORTH", "EAST", "SOUTH", "WEST"],
        },
        yardPositions: {
          type: "array",
          items: { type: "string", enum: ["FRONT", "REAR", "SIDE"] },
        },
        yardSizeMin: { type: "number", description: "Min yard size in m²" },
        epcRatings: {
          type: "array",
          items: { type: "string", enum: ["A", "B", "C", "D", "E", "F", "G"] },
        },
        primaryHeatingTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GAS_CENTRAL",
              "ELECTRIC",
              "OIL",
              "UNDERFLOOR",
              "BIOMASS",
              "HEAT_PUMP",
              "DISTRICT",
              "STORAGE_HEATERS",
              "LPG",
              "PASSIVE",
              "SOLAR_THERMAL",
              "OTHER",
            ],
          },
        },
        secondaryHeatingTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GAS_CENTRAL",
              "ELECTRIC",
              "OIL",
              "UNDERFLOOR",
              "BIOMASS",
              "HEAT_PUMP",
              "DISTRICT",
              "STORAGE_HEATERS",
              "LPG",
              "PASSIVE",
              "SOLAR_THERMAL",
              "OTHER",
            ],
          },
        },
        boilerType: {
          type: "string",
          enum: ["COMBI", "SYSTEM", "CONVENTIONAL", "BACK_BOILER"],
        },
        hotWaterSource: {
          type: "string",
          enum: [
            "BOILER",
            "IMMERSION_HEATER",
            "SOLAR_THERMAL",
            "HEAT_PUMP",
            "OTHER",
          ],
        },
        renewables: {
          type: "array",
          items: {
            type: "string",
            enum: ["SOLAR_PV", "BATTERY_STORAGE", "SMART_METER", "EV_CHARGING"],
          },
        },
        connectedUtilitiesInclude: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GAS",
              "ELECTRICITY",
              "WATER",
              "SEWAGE",
              "DRAINAGE",
              "SEPTIC_TANK",
              "CESSPIT",
              "RAINWATER_HARVESTING",
            ],
          },
        },
        connectedUtilitiesExclude: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GAS",
              "ELECTRICITY",
              "WATER",
              "SEWAGE",
              "DRAINAGE",
              "SEPTIC_TANK",
              "CESSPIT",
              "RAINWATER_HARVESTING",
            ],
          },
        },
        broadbandType: {
          type: "string",
          enum: ["ADSL", "FTTC", "FTTP", "CABLE", "MOBILE"],
        },
        fullFibreAvailable: { type: "boolean" },
        maxDownloadSpeedMin: { type: "number" },
        securityFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "GATED_COMMUNITY",
              "CCTV",
              "ALARM_SYSTEM",
              "NEIGHBORHOOD_WATCH",
              "INTERCOM_SYSTEM",
              "SECURITY",
              "RECEPTION",
            ],
          },
        },
        storageFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "ATTIC",
              "BASEMENT",
              "SEPARATE_DRESSING",
              "UNDER_STAIRS_STORAGE",
            ],
          },
        },
        accessibilityFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "WHEELCHAIR_FRIENDLY",
              "STEP_FREE_ACCESS",
              "WIDE_DOORWAYS",
              "WET_ROOM",
              "HANDRAILS",
              "ELEVATOR",
              "STAIRS",
              "ACCESSIBLE_PARKING",
            ],
          },
        },
        petFriendly: { type: "boolean" },
        buildingFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: ["POOL", "INTERNET", "CONCIERGE", "SHOP", "GYM"],
          },
        },
        bedroomFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "EN_SUITE",
              "BUILT_IN_STORAGE",
              "WALK_IN_WARDROBE",
              "BAY_WINDOW",
              "BALCONY",
              "HAS_VIEW",
              "PATIO_DOORS",
              "BUILT_IN_DESK",
            ],
          },
          description:
            "Features tied to a bedroom. Also set this when the user mentions the feature without specifying a room — pair it with receptionFeatures/otherRoomFeatures so the search spans all room types.",
        },
        bedSizes: {
          type: "array",
          items: {
            type: "string",
            enum: ["SINGLE", "DOUBLE", "QUEEN", "KING", "SUPER_KING"],
          },
        },
        bedroomSizeMin: {
          type: "number",
          description: "Min size of a single bedroom in m²",
        },
        bathroomFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: ["TOILET", "EN_SUITE", "BATHTUB", "WALK_IN_SHOWER"],
          },
        },
        bathroomSizeMin: {
          type: "number",
          description: "Min size of a single bathroom in m²",
        },
        kitchenFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "MODERN",
              "OPEN_PLAN",
              "WHITE_GOODS",
              "BREAKFAST_BAR",
              "ISLAND",
              "UTILITY_ACCESS",
              "PANTRY",
            ],
          },
        },
        kitchenSizeMin: {
          type: "number",
          description: "Min size of a single kitchen in m²",
        },
        receptionTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "LIVING_ROOM",
              "FAMILY_ROOM",
              "DINING_ROOM",
              "GAMES_ROOM",
              "HOME_CINEMA",
            ],
          },
        },
        receptionFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "OPEN_PLAN",
              "OPEN_CONCEPT",
              "FIREPLACE",
              "BALCONY",
              "BAY_WINDOW",
              "BUILT_IN_SHELVING",
              "HAS_VIEW",
              "PATIO_DOORS",
              "BUILT_IN_STORAGE",
              "SERVING_HATCH",
              "BAR_AREA",
              "SOUND_PROOFING",
              "ACCOUSTIC_PANELS",
              "STONE_FLOORING",
              "HARDWOOD_FLOORING",
              "BUILT_IN_DESK",
              "CONSERVATORY",
            ],
          },
        },
        receptionSizeMin: {
          type: "number",
          description: "Min size of a single reception room in m²",
        },
        otherRoomTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "OFFICE",
              "STUDY",
              "LIBRARY",
              "GYM",
              "WORKSHOP",
              "POOL_ROOM",
              "WINE_CELLAR",
              "SPA",
              "OTHER",
            ],
          },
        },
        otherRoomFeatures: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "OPEN_PLAN",
              "OPEN_CONCEPT",
              "FIREPLACE",
              "BALCONY",
              "BAY_WINDOW",
              "BUILT_IN_SHELVING",
              "HAS_VIEW",
              "PATIO_DOORS",
              "BUILT_IN_STORAGE",
              "SERVING_HATCH",
              "BAR_AREA",
              "SOUND_PROOFING",
              "ACCOUSTIC_PANELS",
              "STONE_FLOORING",
              "HARDWOOD_FLOORING",
              "BUILT_IN_DESK",
              "CONSERVATORY",
            ],
          },
        },
        otherRoomSizeMin: {
          type: "number",
          description:
            "Min size of a single other room (office, study, gym, etc.) in m²",
        },
        utilityFeatures: {
          type: "array",
          items: { type: "string", enum: ["STORAGE", "SINK", "PLUMBING"] },
        },
        amenityType: {
          type: "string",
          enum: [
            "TRANSPORT",
            "EDUCATION",
            "HEALTHCARE",
            "SHOPPING_ENTERTAINMENT",
            "GREEN_SPACE",
          ],
        },
        amenitySubtype: {
          type: "string",
          enum: [
            "TRAIN_STATION",
            "BUS_STOP",
            "MOTORWAY_ACCESS",
            "SCHOOL",
            "UNIVERSITY",
            "HOSPITAL",
            "MEDICAL_CENTRE",
            "SHOP",
            "RESTAURANT",
            "CINEMA",
            "GYM",
            "PARK",
            "TRAIL",
            "PLAYGROUND",
            "OTHER",
          ],
        },
        amenityDistanceMax: { type: "number" },
        councilTaxBand: {
          type: "string",
          enum: ["A", "B", "C", "D", "E", "F", "G", "H"],
        },
        serviceChargesMax: { type: "number" },
        groundRentMax: { type: "number" },
        moveInDateBefore: {
          type: "string",
          description:
            "ISO date (YYYY-MM-DD) — include listings available on or before this date",
        },
        moveInDateAfter: {
          type: "string",
          description:
            "ISO date (YYYY-MM-DD) — include listings available from this date",
        },
        sellerUsername: {
          type: "string",
          description:
            "Exact username of the seller/owner who listed the property. Only set when the user explicitly references a specific username (e.g. 'listings by john.doe', 'properties from @jane'). Extract only the username handle, not any @ prefix.",
        },

        usedTerms: {
          type: "array",
          items: { type: "string" },
          description:
            "REQUIRED. Short human-readable label for every filter you set. One label per distinct concept. Examples: For sale, 3+ bedrooms, Under £400000, Detached house, Chain free, South-facing garden, Pet friendly, EPC C or better, Near a school. Must not be empty if any parameters were set.",
        },
        ignoredTerms: {
          type: "array",
          items: { type: "string" },
          description:
            "Parts of the query you could not map to any filter. Return [] if nothing was ignored.",
        },
      },
      required: ["usedTerms"],
      additionalProperties: false,
    },
  },
};
