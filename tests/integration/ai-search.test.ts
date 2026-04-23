// @vitest-environment node
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";

const DEFAULT_LOCATION = {
  geometry: {
    coordinates: [-3.1791, 51.4816], // Cardiff City Centre [lon, lat]
  },
};

// Queries expected to return results — only broad queries guaranteed to match seed data
const queriesExpectingResults: string[] = [
  // Basic searches
  "House for sale",
  "Flat for rent",
  "Property for sale",
  "Property to rent",

  // Price ranges — the human way
  "Houses for sale between £150,000 and £400,000",
  "Flats to rent between £700 and £1,500 a month",
  "House for sale under £500,000",

  // Bedroom counts and ranges
  "2 bedroom house for sale",
  "3 bedroom house for sale",
  "2 or 3 bedroom house for sale",
  "2 to 3 bedroom flat for rent",
];

// All other queries — tests only that the AI + Prisma don't crash (0 results is fine).
// Queries are phrased as real people search, not as API tests.
const queriesNocrash: string[] = [
  // --- TENURE & CHAIN (sale) ---
  "Looking for a freehold house, 3 or 4 beds, no chain, somewhere under £400k",
  "Leasehold flat is fine, 2 bedrooms, somewhere central, under £250k",
  "Need to be chain free — kids starting school in September, 3 beds",
  "Interested in shared ownership, 2 bed flat, as cheap as possible",
  "Commonhold or freehold only, don't want leasehold, 2+ beds",
  "Guide price house for sale, flexible on budget, 3 beds minimum",

  // --- RENTAL SPECIFICS ---
  "Fully furnished flat to rent, bills included, I just want to move in, £1,200 max a month",
  "Looking to rent something unfurnished, settled long term, family home, 3 beds, under £1,600",
  "Need a place I can move into next month, furnished, pets considered, around £1,000 pcm",
  "Studio near the university, bills included, under £800 a month",
  "Short term let available now, flexible on size, just need somewhere decent",
  "1 bed flat to rent, prefer part furnished, short term contract is fine, under £900/month",
  "3 bed house to rent with a garden, pets allowed, unfurnished, budget £2,000/month",
  "Flat to rent with deposit under £2,000, furnished, near a bus stop",
  "Long term tenancy only, 2 beds, monthly payments, under £1,500",
  "House to rent with let agreed status just to browse what's gone",

  // --- BEDROOM & BATHROOM RANGES ---
  "We need at least 4 bedrooms — kids need their own rooms, garden essential",
  "Just the two of us, 2 bedrooms is plenty, somewhere compact and modern",
  "Ideally 2 or 3 bedrooms, open to either, budget around £325k",
  "Somewhere between 3 and 5 bedrooms, big enough for a growing family, under £500k",
  "Studio flat for sale — first buyer, tight budget",
  "4+ bedrooms, detached or semi, driveway, good schools nearby",
  "At least 2 bathrooms, 3 beds, en-suite for the main bedroom",
  "3 bed house with 2 bathrooms, one for the kids, under £350k",

  // --- EN-SUITE & BEDROOM FEATURES ---
  "Master bedroom with en-suite and walk-in wardrobe, 4 bed house, freehold",
  "All double bedrooms, en-suite, 3 bed semi, under £300k",
  "Bedroom with a bay window would be lovely, any other features considered",
  "Built-in wardrobes in all bedrooms, 3+ beds, under £400k",

  // --- BATHROOMS ---
  "Walk-in shower rather than a bath, 3 bed house for sale",
  "En-suite bathroom essential, at least 3 bedrooms, under £475k",
  "Family bathroom plus an en-suite, 4 beds, detached, under £600k",

  // --- KITCHENS ---
  "Open plan kitchen/diner is a must, 3 beds, south facing garden, under £375k",
  "Love a kitchen island and breakfast bar, modern kitchen, large family home",
  "Utility room and pantry would be amazing, 4 bed house for sale",
  "White goods included in the rent, 2 bed flat, furnished",
  "Kitchen with space for a big table, dining area open to the garden",

  // --- RECEPTION ROOMS ---
  "Separate dining room as well as a lounge, 3 bed semi",
  "Two reception rooms, 4 bed detached, home cinema would be a dream",
  "Big family room that flows into the garden, 3+ beds, under £450k",

  // --- HOME OFFICE / OTHER ROOMS ---
  "Home office or study is non-negotiable, WFH full time, 3+ beds",
  "Gym room or space to convert, 4 bed detached, under £600k",
  "Workshop in the garden or garage, 3 bed house, rural area fine",

  // --- PARKING ---
  "Double garage essential, 4 bed house, needs space for 2 cars and storage",
  "Driveway for at least 2 cars, ideally off the road, 3 beds, under £375k",
  "EV charging point in garage or driveway, eco-friendly modern home",
  "Allocated parking in the building, 2 bed flat, city centre",
  "Carport or covered parking, 3 bed house, under £300k",
  "Permit parking area, second floor flat, city, under £200k",
  "No parking at all is fine, close to public transport, 1 bed flat",
  "Off-street parking, not keen on permit zones, 3 bed semi, under £350k",

  // --- GARDENS & OUTDOOR ---
  "Big south facing rear garden, kids can play, trampoline space, 3 or 4 beds",
  "Even a small courtyard or patio is enough, flat, city centre to rent",
  "Private rear garden not overlooked, around 3 beds, under £400k",
  "Large garden, space for a veg patch and a shed, rural location fine",
  "Balcony with a decent view, 2 bed flat, ideally south or west facing",
  "Wrap-around garden or large plot, detached, plenty of outdoor space, under £650k",
  "Garden big enough for a summer house or garden office, 3+ beds",
  "Swimming pool or space to put one in, big budget, 5 bed detached",
  "Front and rear garden, off-road parking, 3 bed semi, family home",

  // --- EPC & ENERGY EFFICIENCY ---
  "Running costs matter to us a lot — EPC B or better, modern heating",
  "Eco friendly home, good energy rating, ideally solar panels already installed",
  "EPC D is fine, older period property, we'll improve it ourselves",
  "Something really efficient — A rated if possible, new build, 3 beds",
  "Not too fussed about EPC but want gas central heating at least",

  // --- HEATING SYSTEMS ---
  "Gas central heating, combi boiler, 3 bed house, under £350k",
  "Underfloor heating throughout would be luxury — 4 bed detached, modern build",
  "Heat pump installed already, eco home, good insulation, 3 beds",
  "Oil heating is fine, rural cottage, 3 beds, large plot",
  "Electric heating, no gas supply, village property, 2+ beds",
  "Biomass boiler or log burner, countryside, large house, flexible budget",
  "LPG heating, off-grid property preferred, 3 beds, rural",
  "Storage heaters, flat purchase, leasehold, under £180k",
  "Underfloor heating and solar thermal hot water — efficient and cosy",

  // --- BOILER ---
  "Combi boiler recently replaced, 3 bed semi, under £325k",
  "System boiler with hot water tank, large family home, 4+ beds",

  // --- RENEWABLES & SMART HOME ---
  "Solar panels already on the roof, saves on bills, 3+ beds",
  "Battery storage and solar — want to be as off-grid as possible",
  "EV charging, solar panels, good EPC — full eco setup, 3 beds, under £500k",
  "Smart meter fitted, fast broadband, tech-friendly modern home",

  // --- BROADBAND ---
  "Full fibre broadband essential — I work from home all day, 3 bed house",
  "Superfast broadband, 200mbps+, rural property with good connectivity",

  // --- SECURITY ---
  "Alarm system, ideally monitored, 3 bed family home, under £375k",
  "Flat with video intercom and CCTV, city centre, security conscious buyer",
  "Gated development with concierge, 2 bed luxury flat, under £400k",
  "Gated community with electric gates, detached house, private feel",

  // --- ACCESSIBILITY ---
  "Step-free access throughout, wide doorways, ground floor flat or bungalow",
  "Wheelchair accessible, no steps, level access to garden",
  "Lift in the building, 2 bed flat, not ground floor, accessible throughout",
  "Wet room instead of a bath, level access shower, mobility needs considered",
  "Accessible parking bay, flat, ground floor preferred",

  // --- STORAGE ---
  "Loft with good storage — boarding and insulation, 3 bed house",
  "Basement or cellar, period property, loads of storage",
  "Under stairs cupboard as a minimum, 3 bed terraced house, under £300k",
  "Dressing room off the master bedroom, 4 bed detached, luxury end",

  // --- ADDITIONAL FEATURES ---
  "Pets are essential — landlord must allow dogs, 2 bed house to rent, garden",
  "Allow cats, furnished 1 bed flat to rent, under £1,000",
  "Building with a gym so I don't need a gym membership, 2 bed flat",
  "Communal pool in the development, flat, warm, luxury lifestyle",
  "Internet and WiFi included in the rent, bills included flat, city",

  // --- RUNNING COSTS ---
  "Low council tax area, Band A if possible, 3 bed under £300k",
  "Looking for Band B council tax, family home, under £350k",
  "Low service charges, leasehold flat, 2 beds, under £200k",
  "Realistic service charges — nothing over £150/month, 2 bed flat for sale",

  // --- PROPERTY TYPE & BUILD ---
  "New build with warranty, 3 beds, freehold, EPC A, under £400k",
  "Non-standard construction is fine — timber or steel frame, we're handy",
  "Built in the last 10 years, 3 bed, modern estate, under £380k",
  "Ground floor flat, no stairs, small garden or patio, quiet area",
  "Empty and vacant, ready to move in now, 3 beds, under £400k",

  // --- AMENITIES & LOCATION ---
  "Walking distance to a good train station, commuter town, 3 bed house",
  "In catchment for a well rated school — the kids are 5 and 8, 4 bed house",
  "Nice park nearby, toddler friendly area, 3 bed semi with garden under £350k",
  "Within a few minutes of a hospital, 2 bed flat to rent for work",
  "University area, investment property, 2 beds, under £200k",
  "Close to a motorway junction but quiet enough to live, 4 bed detached",
  "Lively area with restaurants and bars, modern flat to rent",
  "Gym and restaurants walkable, city centre 2 bed flat to rent, under £1,500",
  "Playground within walking distance, family home, 3+ beds",
  "Bus stop nearby, no car, so transport links matter, 2 bed flat",

  // --- SIZE ---
  "Generous square footage, at least 100 sqm inside, 3 bed house",
  "Big enough for two of us and an office, about 80m² minimum",
  "Large garden plot, over 100m², 3+ beds, semi-rural",
  "Compact starter home, around 60–70 sqm, under £200k",

  // --- COMPLEX / REAL SEARCH COMBOS ---
  "3 bed semi with a south facing garden, driveway, catchment for St John's school, under £325k",
  "4 bed detached, chain free, freehold, double garage, EPC B or better, under £600k",
  "2 bed furnished flat to rent near a train station, bills included, pets welcome, under £1,300/month",
  "Eco home — solar panels, heat pump, battery storage, EPC A or B, 3+ beds, under £500k",
  "Family home 3–4 beds, open plan kitchen, big garden, good school nearby, driveway, under £425k",
  "Modern apartment with concierge, allocated parking, balcony, city centre, energy efficient",
  "Accessible bungalow, step-free inside and out, big garden, level access shower, under £350k",
  "4 bed freehold, no chain, south facing garden over 100m², home office, under £550k",
  "Furnished 1 bed near campus, under £750/month, bills included, good broadband",
  "Leasehold flat, share of freehold ideally, 2 beds, 2 baths, low service charges, EPC B",
  "Investment buy-to-let, 2 beds, ideally tenanted already, under £200k",
  "Holiday cottage style, rural, oil or biomass heating, 3 beds, large garden",
  "Home cinema, gym room and a study, no budget limit, 5+ beds, detached",
  "Ground floor flat to rent available now, 1 bed, part furnished, near a bus stop, under £900",
  "Period terrace with character, 3 beds, fireplaces, garden, under £400k",
  "Modern flat, 2 beds, concierge, EV charging, great commuter links, under £350k",

  // --- NEW FILTERS ---

  "Flat to rent with a holding deposit under £500",
  "House for sale with underfloor heating as a secondary heating source",
  "House for sale with all king size beds",
  "3 bed house with king size and double beds for sale",
  "House for sale with single beds only",
  "House for sale with super king bed in the master bedroom",
  "3 bed house with a living room and a dining room for sale",
  "House for sale with both a family room and a games room",
  "House for sale with a log burner as secondary heating",
  "Flat to rent available from September",
  "2 bed flat available within the next 3 months, to rent",
  "Flat to rent available by the end of next month",
  "House for sale with a garden over 100 square metres",
  "Property with at least 500 square metres of total outdoor space",
  "House for sale with a separate parcel of land",
  "House for sale built after 2000",
  "House for sale built between 1950 and 1980",
  "2 bed flat in a low-rise block, no more than 4 floors",
  "Farmhouse for sale with at least 2 kitchens",
  "Large house with 3 or more other rooms beyond the main rooms",

  // --- EDGE CASES ---
  "Property for sale with absolutely no filters at all",
  "House for rent with absolutely no filters at all",
  "Something really cheap, under £50,000, anything",
  "The most expensive property you have, no limit",
  "Studio or 1 bed tiny flat, just need a roof, under £120k",
  "House for sale that happens to also be available to rent",
  "3 bedroom house priced between £1 and £100 — long shot",
  "Flat with genuinely every accessibility feature possible",
  "Planet-friendly eco home with literally every green feature",
  "10 or more bedrooms — need more space than any normal family",

  // --- RECENTLY ADDED FIELDS ---
  "At most 2 bathrooms, 3 bed house for sale",
  "House for sale with a master bedroom at least 15 square metres",
  "Home office with a view, 4 beds",
  "House with a south facing yard",
  "Property with at least an acre of land",
  "House near a walking trail or footpath",
  "Council tax band D, 3 bed house for sale",
];

// Queries that verify the AI put each field in the correct nesting location.
// A 200 response with 0 results would NOT catch these — we check generatedWhereClause directly.
type ClauseCheck = {
  query: string;
  expectInClause: (clause: Record<string, unknown>) => void;
};
const queriesWithClauseChecks: ClauseCheck[] = [
  // SALE LISTING FIELDS — must be inside saleListing: { is: { ... } }
  {
    query: "Freehold house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.saleListing?.is?.tenureType,
        "tenureType must be in saleListing.is",
      ).toBe("FREEHOLD"),
  },
  {
    query: "Leasehold flat for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.saleListing?.is?.tenureType,
        "tenureType must be in saleListing.is",
      ).toBe("LEASEHOLD"),
  },
  {
    query: "Chain free house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(c.saleListing?.is?.chain, "chain must be in saleListing.is").toBe(
        false,
      ),
  },
  {
    query: "Shared ownership flat for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.saleListing?.is?.sharedOwnership,
        "sharedOwnership must be in saleListing.is",
      ).toBe(true),
  },
  {
    query: "House for sale that is under offer",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.saleListing?.is?.availabilityStatus,
        "availabilityStatus must be in saleListing.is",
      ).toBe("UNDER_OFFER"),
  },
  {
    query: "House for sale with a fixed price under £350,000",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.saleListing?.is?.priceType,
        "priceType must be in saleListing.is",
      ).toBe("FIXED");
      const lte = c.price?.lte ?? c.saleListing?.is?.price?.lte;
      expect(lte, "price.lte must be ≤ 350000").toBeLessThanOrEqual(350000);
    },
  },
  {
    query: "House for sale with offers over £200,000",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.saleListing?.is?.priceType,
        "priceType must be in saleListing.is",
      ).toBe("OFFERS_OVER"),
  },

  // RENTAL LISTING FIELDS — must be inside rentalListing: { is: { ... } }
  {
    query: "Furnished flat for rent",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.furnishedStatus,
        "furnishedStatus must be in rentalListing.is",
      ).toBe("FURNISHED"),
  },
  {
    query: "Unfurnished house for rent",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.furnishedStatus,
        "furnishedStatus must be in rentalListing.is",
      ).toBe("UNFURNISHED"),
  },
  {
    query: "Part furnished flat for rent",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.furnishedStatus,
        "furnishedStatus must be in rentalListing.is",
      ).toBe("PART_FURNISHED"),
  },
  {
    query: "House for rent with bills included",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.isBillsIncluded,
        "isBillsIncluded must be in rentalListing.is",
      ).toBe(true),
  },
  {
    query: "House for rent available short term",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.rentalLength,
        "rentalLength must be in rentalListing.is",
      ).toBe("SHORT_TERM"),
  },
  {
    query: "House for rent available long term",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.rentalLength,
        "rentalLength must be in rentalListing.is",
      ).toBe("LONG_TERM"),
  },
  {
    query: "House for rent paid weekly",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.rentFrequency,
        "rentFrequency must be in rentalListing.is",
      ).toBe("WEEKLY"),
  },
  {
    query: "House for rent with let agreed status",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.rentalListing?.is?.availabilityStatus,
        "availabilityStatus must be in rentalListing.is",
      ).toBe("LET_AGREED"),
  },
  {
    query: "Flat for rent with deposit under £2,000",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const lte = c.rentalListing?.is?.deposit?.lte;
      expect(
        lte,
        "deposit.lte must be inside rentalListing.is",
      ).toBeLessThanOrEqual(2000);
    },
  },

  // KITCHEN FIELD NAME — must use kitchenFeatures, not kitchen
  {
    query: "House for sale with an open plan kitchen",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.property?.is?.kitchen,
        "field must be kitchenFeatures, not kitchen",
      ).toBeUndefined();
      expect(
        c.property?.is?.kitchenFeatures,
        "kitchenFeatures must exist inside property.is",
      ).toBeDefined();
    },
  },

  // BEDROOM RANGE — gte/lte inside property.is.numberBedrooms
  {
    query: "2 or 3 bedroom house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.property?.is?.numberBedrooms?.gte,
        "numberBedrooms.gte must be 2",
      ).toBe(2);
      expect(
        c.property?.is?.numberBedrooms?.lte,
        "numberBedrooms.lte must be 3",
      ).toBe(3);
    },
  },
  {
    query: "House for sale with at least 4 bedrooms",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.property?.is?.numberBedrooms?.gte,
        "numberBedrooms.gte must be ≥ 4",
      ).toBeGreaterThanOrEqual(4),
  },
  {
    query: "House for sale with fewer than 3 bedrooms",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.property?.is?.numberBedrooms?.lt,
        "numberBedrooms.lt must be used for 'fewer than'",
      ).toBe(3),
  },

  // PRICE RANGE — must be at root level, never inside saleListing or property
  {
    query: "Houses for sale between £200,000 and £400,000",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.price?.gte,
        "price.gte must be at root level",
      ).toBeGreaterThanOrEqual(200000);
      expect(
        c.price?.lte,
        "price.lte must be at root level",
      ).toBeLessThanOrEqual(400000);
      expect(
        c.saleListing?.is?.price,
        "price must not be inside saleListing.is",
      ).toBeUndefined();
      expect(
        c.property?.is?.price,
        "price must not be inside property.is",
      ).toBeUndefined();
    },
  },
  {
    query: "Flat to rent between £800 and £1,200 per month",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.price?.gte,
        "price.gte must be at root level",
      ).toBeGreaterThanOrEqual(800);
      expect(
        c.price?.lte,
        "price.lte must be at root level",
      ).toBeLessThanOrEqual(1200);
      expect(
        c.rentalListing?.is?.price,
        "price must not be inside rentalListing.is",
      ).toBeUndefined();
    },
  },

  // PARKING — must be inside property.is.parking.is.features
  {
    query: "House for sale with a garage",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.property?.is?.parking?.is?.features?.has,
        "garage must be in property.is.parking.is.features.has",
      ).toBe("GARAGE");
      expect(c.parking, "parking must not be at root level").toBeUndefined();
    },
  },
  {
    query: "House for sale with a driveway",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) =>
      expect(
        c.property?.is?.parking?.is?.features?.has,
        "driveway must be in property.is.parking.is.features.has",
      ).toBe("DRIVEWAY"),
  },

  // AMENITIES — must be inside property.is.amenities.some, never at root
  {
    query: "House for sale near a school",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be EDUCATION").toBe("EDUCATION");
      expect(amenity?.subtype, "amenity subtype must be SCHOOL").toBe("SCHOOL");
      expect(
        c.amenities,
        "amenities must not be at root level",
      ).toBeUndefined();
    },
  },
  {
    query: "House for sale near a train station",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be TRANSPORT").toBe("TRANSPORT");
      expect(amenity?.subtype, "amenity subtype must be TRAIN_STATION").toBe(
        "TRAIN_STATION",
      );
      expect(
        c.amenities,
        "amenities must not be at root level",
      ).toBeUndefined();
    },
  },
  {
    query: "House for sale close to a motorway junction",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be TRANSPORT").toBe("TRANSPORT");
      expect(amenity?.subtype, "amenity subtype must be MOTORWAY_ACCESS").toBe(
        "MOTORWAY_ACCESS",
      );
      expect(
        c.amenities,
        "amenities must not be at root level",
      ).toBeUndefined();
    },
  },
  {
    query: "Flat to rent near a bus stop",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be TRANSPORT").toBe("TRANSPORT");
      expect(amenity?.subtype, "amenity subtype must be BUS_STOP").toBe(
        "BUS_STOP",
      );
    },
  },
  {
    query: "House for sale near a park",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be GREEN_SPACE").toBe(
        "GREEN_SPACE",
      );
      expect(amenity?.subtype, "amenity subtype must be PARK").toBe("PARK");
    },
  },
  {
    query: "2 bed flat to rent near a hospital",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be HEALTHCARE").toBe(
        "HEALTHCARE",
      );
      expect(amenity?.subtype, "amenity subtype must be HOSPITAL").toBe(
        "HOSPITAL",
      );
    },
  },

  // GARDEN — must be inside property.is.outdoorSpace.is.garden.some
  {
    query: "House for sale with a south facing garden",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const garden = c.property?.is?.outdoorSpace?.is?.garden?.some;
      expect(
        garden,
        "garden must be in property.is.outdoorSpace.is.garden.some",
      ).toBeDefined();
      expect(garden?.facing, "facing must be SOUTH").toBe("SOUTH");
      expect(c.garden, "garden must not be at root level").toBeUndefined();
    },
  },
  {
    query: "House for sale with a rear garden",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const garden = c.property?.is?.outdoorSpace?.is?.garden?.some;
      expect(
        garden,
        "garden must be in property.is.outdoorSpace.is.garden.some",
      ).toBeDefined();
      expect(garden?.position, "position must be REAR").toBe("REAR");
    },
  },

  // EPC — must be inside property.is.energyAndUtilities.is using 'in' array
  {
    query: "House for sale with EPC rating C or better",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const epc = c.property?.is?.energyAndUtilities?.is?.epcRating;
      expect(
        epc,
        "epcRating must be in property.is.energyAndUtilities.is",
      ).toBeDefined();
      expect(
        Array.isArray(epc?.in),
        "epcRating must use 'in' array — never gte/lte on enums",
      ).toBe(true);
      expect(epc?.in, "C or better must include A, B, C").toEqual(
        expect.arrayContaining(["A", "B", "C"]),
      );
      expect(epc?.in?.length, "C or better must have exactly 3 values").toBe(3);
      expect(
        c.epcRating,
        "epcRating must not be at root level",
      ).toBeUndefined();
    },
  },
  {
    query: "House for sale with EPC rating D or worse",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const epc = c.property?.is?.energyAndUtilities?.is?.epcRating;
      expect(
        epc,
        "epcRating must be in property.is.energyAndUtilities.is",
      ).toBeDefined();
      expect(Array.isArray(epc?.in), "epcRating must use 'in' array").toBe(
        true,
      );
      expect(epc?.in, "D or worse must include D, E, F, G").toEqual(
        expect.arrayContaining(["D", "E", "F", "G"]),
      );
      expect(epc?.in?.length, "D or worse must have exactly 4 values").toBe(4);
    },
  },

  // HEATING — must be inside property.is.energyAndUtilities.is.primaryHeatingType
  {
    query: "House for sale with gas central heating",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const heating =
        c.property?.is?.energyAndUtilities?.is?.primaryHeatingType;
      expect(
        heating,
        "primaryHeatingType must be in property.is.energyAndUtilities.is",
      ).toBeDefined();
      expect(
        heating?.has,
        "gas central heating must use has: GAS_CENTRAL",
      ).toBe("GAS_CENTRAL");
      expect(
        c.primaryHeatingType,
        "primaryHeatingType must not be at root level",
      ).toBeUndefined();
    },
  },
  {
    query: "House for sale with underfloor heating",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const heating =
        c.property?.is?.energyAndUtilities?.is?.primaryHeatingType;
      expect(
        heating,
        "primaryHeatingType must be in property.is.energyAndUtilities.is",
      ).toBeDefined();
      expect(heating?.has, "underfloor heating must use has: UNDERFLOOR").toBe(
        "UNDERFLOOR",
      );
    },
  },

  // FURNISHED STATUS — must be inside rentalListing.is, NOT at root or inside property
  {
    query: "Furnished 2 bedroom flat to rent",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.rentalListing?.is?.furnishedStatus,
        "furnishedStatus must be in rentalListing.is",
      ).toBe("FURNISHED");
      expect(
        c.furnishedStatus,
        "furnishedStatus must not be at root level",
      ).toBeUndefined();
      expect(
        c.property?.is?.furnishedStatus,
        "furnishedStatus must not be inside property.is",
      ).toBeUndefined();
    },
  },

  // BILLS INCLUDED — must be inside rentalListing.is
  {
    query: "Flat to rent with bills included",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.rentalListing?.is?.isBillsIncluded,
        "isBillsIncluded must be in rentalListing.is",
      ).toBe(true);
      expect(
        c.isBillsIncluded,
        "isBillsIncluded must not be at root level",
      ).toBeUndefined();
      expect(
        c.property?.is?.isBillsIncluded,
        "isBillsIncluded must not be inside property.is",
      ).toBeUndefined();
    },
  },

  // NO CHAIN — must use saleListing.is.chain (not property.is.chainFree)
  {
    query: "No chain house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.saleListing?.is?.chain,
        "chain=false must be in saleListing.is",
      ).toBe(false);
      expect(c.chain, "chain must not be at root level").toBeUndefined();
      expect(
        c.property?.is?.chain,
        "chain must not be in property.is",
      ).toBeUndefined();
      expect(
        c.property?.is?.chainFree,
        "chainFree on property must not be used — use saleListing.is.chain",
      ).toBeUndefined();
    },
  },

  // TENURE — must be inside saleListing.is, NOT at root or inside property
  {
    query: "Freehold detached house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.saleListing?.is?.tenureType,
        "tenureType must be in saleListing.is",
      ).toBe("FREEHOLD");
      expect(
        c.tenureType,
        "tenureType must not be at root level",
      ).toBeUndefined();
      expect(
        c.property?.is?.tenureType,
        "tenureType must not be inside property.is",
      ).toBeUndefined();
    },
  },

  // PROPERTY TYPE — must be property.is.type (sibling to classification, never nested inside it)
  {
    query: "Detached house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.property?.is?.type,
        "type must be in property.is.type",
      ).toBeDefined();
      expect(
        c.property?.is?.classification?.type,
        "type must not be nested inside classification",
      ).toBeUndefined();
    },
  },

  // BED SIZES — must be inside property.is.bedroomFeatures.some.bed (has / hasSome)
  {
    query: "House for sale with a king size bed",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const bed = c.property?.is?.bedroomFeatures?.some?.bed;
      expect(
        bed,
        "bed must be in property.is.bedroomFeatures.some.bed",
      ).toBeDefined();
      expect(bed?.has, "single bed size must use has: KING").toBe("KING");
      expect(c.bedSizes, "bedSizes must not be at root level").toBeUndefined();
    },
  },
  {
    query: "House for sale with all double beds",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const bed = c.property?.is?.bedroomFeatures?.some?.bed;
      expect(
        bed,
        "bed must be in property.is.bedroomFeatures.some.bed",
      ).toBeDefined();
      // single value → has, multiple → hasSome
      const hasDouble =
        bed?.has === "DOUBLE" || bed?.hasSome?.includes("DOUBLE");
      expect(hasDouble, "DOUBLE must appear in bed filter").toBe(true);
    },
  },

  // SECONDARY HEATING — must be inside property.is.energyAndUtilities.is.secondaryHeatingType
  {
    query: "House for sale with a log burner as secondary heating",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const secondary =
        c.property?.is?.energyAndUtilities?.is?.secondaryHeatingType;
      expect(
        secondary,
        "secondaryHeatingType must be in property.is.energyAndUtilities.is",
      ).toBeDefined();
      expect(
        c.secondaryHeatingType,
        "secondaryHeatingType must not be at root level",
      ).toBeUndefined();
    },
  },

  // RECEPTION TYPES — multi-value must use { in: [...] }, not silently drop values
  {
    query: "3 bed house for sale with a living room and a dining room",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const rec = c.property?.is?.reception?.some;
      expect(
        rec,
        "reception must be in property.is.reception.some",
      ).toBeDefined();
      // If only 1 type returned it can be a scalar; if 2 types it must be { in: [...] }
      if (rec?.type?.in) {
        expect(
          rec.type.in,
          "multi-type reception must include LIVING_ROOM and DINING_ROOM",
        ).toEqual(expect.arrayContaining(["LIVING_ROOM", "DINING_ROOM"]));
      }
    },
  },

  // HOLDING DEPOSIT — must be inside rentalListing.is.holdingDeposit.lte
  {
    query: "Flat to rent with holding deposit under £500",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const lte = c.rentalListing?.is?.holdingDeposit?.lte;
      expect(
        lte,
        "holdingDeposit.lte must be inside rentalListing.is",
      ).toBeLessThanOrEqual(500);
      expect(
        c.holdingDeposit,
        "holdingDeposit must not be at root level",
      ).toBeUndefined();
    },
  },

  // MOVE-IN DATE — must be at root level as moveInDate.lte / moveInDate.gte
  {
    query: "Flat to rent available within the next 3 months",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.moveInDate?.lte,
        "moveInDate.lte must be at root level for availability deadline",
      ).toBeDefined();
      expect(
        c.property?.is?.moveInDate,
        "moveInDate must not be inside property.is",
      ).toBeUndefined();
    },
  },
  {
    query: "House to rent available from September",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.moveInDate?.gte,
        "moveInDate.gte must be at root level for available from date",
      ).toBeDefined();
      expect(
        c.property?.is?.moveInDate,
        "moveInDate must not be inside property.is",
      ).toBeUndefined();
    },
  },

  // COUNCIL TAX BAND — must be inside property.is.runningCosts.is
  {
    query: "Council tax band D, 3 bed house for sale",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const band = c.property?.is?.runningCosts?.is?.councilTaxBand;
      expect(
        band,
        "councilTaxBand must be in property.is.runningCosts.is",
      ).toBe("D");
      expect(
        c.councilTaxBand,
        "councilTaxBand must not be at root level",
      ).toBeUndefined();
    },
  },

  // BATHROOMS MAX — must use property.is.numberBathrooms.lte
  {
    query: "House for sale with at most 2 bathrooms",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      expect(
        c.property?.is?.numberBathrooms?.lte,
        "numberBathrooms.lte must be ≤ 2",
      ).toBeLessThanOrEqual(2);
    },
  },

  // BEDROOM SIZE — must use property.is.bedroomFeatures.some.size.gte
  {
    query: "House for sale with a master bedroom at least 15 square metres",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const size = c.property?.is?.bedroomFeatures?.some?.size?.gte;
      expect(
        size,
        "bedroomFeatures.some.size.gte must be set for bedroom size filter",
      ).toBeDefined();
      expect(size, "size must be ≥ 15").toBeGreaterThanOrEqual(15);
    },
  },

  // KITCHEN SIZE — must use property.is.kitchenFeatures.some.size.gte
  {
    query: "House for sale with a kitchen bigger than 20 square metres",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const size = c.property?.is?.kitchenFeatures?.some?.size?.gte;
      expect(
        size,
        "kitchenFeatures.some.size.gte must be set for kitchen size filter",
      ).toBeDefined();
    },
  },

  // RECEPTION SIZE — must use property.is.reception.some.size.gte
  {
    query: "House for sale with a living room larger than 25 square metres",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const size = c.property?.is?.reception?.some?.size?.gte;
      expect(
        size,
        "reception.some.size.gte must be set for reception size filter",
      ).toBeDefined();
    },
  },

  // YARD — must be inside property.is.outdoorSpace.is.yard.some
  {
    query: "House for sale with a south facing yard",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const yard = c.property?.is?.outdoorSpace?.is?.yard?.some;
      expect(
        yard,
        "yard must be in property.is.outdoorSpace.is.yard.some",
      ).toBeDefined();
      expect(yard?.facing, "facing must be SOUTH").toBe("SOUTH");
      expect(c.yard, "yard must not be at root level").toBeUndefined();
    },
  },

  // LAND SIZE — must be inside property.is.outdoorSpace.is.land.some.size.gte
  {
    query: "Property with at least 2000 square metres of land",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const size = c.property?.is?.outdoorSpace?.is?.land?.some?.size?.gte;
      expect(
        size,
        "land.some.size.gte must be in property.is.outdoorSpace.is.land.some",
      ).toBeDefined();
      expect(size, "size must be ≥ 2000").toBeGreaterThanOrEqual(2000);
    },
  },

  // OTHER ROOM FEATURES — must use property.is.otherRoom.some.features
  {
    query: "House for sale with a home office that has a built in desk",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const room = c.property?.is?.otherRoom?.some;
      expect(
        room,
        "otherRoom must be in property.is.otherRoom.some",
      ).toBeDefined();
      expect(
        c.otherRoom,
        "otherRoom must not be at root level",
      ).toBeUndefined();
    },
  },

  // AMENITY TRAIL — must map to GREEN_SPACE + TRAIL
  {
    query: "House for sale near a walking trail",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(amenity?.type, "amenity type must be GREEN_SPACE for trail").toBe(
        "GREEN_SPACE",
      );
      expect(amenity?.subtype, "amenity subtype must be TRAIL").toBe("TRAIL");
    },
  },

  // AMENITY DISTANCE MAX — must use property.is.amenities.some.distanceM.lte
  {
    query: "House for sale within 500 metres of a train station",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectInClause: (c: any) => {
      const amenity = c.property?.is?.amenities?.some;
      expect(
        amenity,
        "amenities must be inside property.is.amenities.some",
      ).toBeDefined();
      expect(
        amenity?.distanceM?.lte,
        "distanceM.lte must be set for amenity distance filter",
      ).toBeDefined();
      expect(
        amenity?.distanceM?.lte,
        "distanceM.lte must be ≤ 500",
      ).toBeLessThanOrEqual(500);
    },
  },
];

describe.sequential("AI search — RAG query parsing", () => {
  describe.sequential("should return results", () => {
    it.each(queriesExpectingResults)(
      "%s",
      async (query) => {
        const res = await fetch(`${BASE_URL}/api/search/rag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            listingType: "all",
            location: DEFAULT_LOCATION,
            radius: 40,
          }),
        });

        const data = await res.json();

        expect(res.ok, `${query} — ${data.message ?? res.statusText}`).toBe(
          true,
        );
        expect(typeof data.count).toBe("number");
        expect(
          data.count,
          `Expected results but got 0 for: "${query}"`,
        ).toBeGreaterThan(0);

        console.log(`  → ${data.count} results (${data.effectiveListingType})`);
      },
      30_000,
    );
  });

  describe.sequential("should not crash", () => {
    it.each(queriesNocrash)(
      "%s",
      async (query) => {
        const res = await fetch(`${BASE_URL}/api/search/rag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            listingType: "all",
            location: DEFAULT_LOCATION,
            radius: 40,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            `\n  FAILED: "${query}"\n  Status: ${res.status}\n  Error: ${data.message ?? data.statusMessage ?? res.statusText}`,
          );
        }

        expect(
          res.ok,
          `${res.status} — ${data.message ?? data.statusMessage ?? res.statusText}`,
        ).toBe(true);
        expect(typeof data.count).toBe("number");

        console.log(`  → ${data.count} results (${data.effectiveListingType})`);
      },
      30_000,
    );
  });

  describe.sequential("should generate correct where clause", () => {
    it.each(queriesWithClauseChecks)(
      "$query",
      async ({ query, expectInClause }) => {
        const res = await fetch(`${BASE_URL}/api/search/rag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            listingType: "all",
            location: DEFAULT_LOCATION,
            radius: 40,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            `\n  FAILED: "${query}"\n  Status: ${res.status}\n  Error: ${
              data.message ?? data.statusMessage ?? res.statusText
            }`,
          );
        }

        expect(
          res.ok,
          `${res.status} — ${data.message ?? data.statusMessage ?? res.statusText}`,
        ).toBe(true);

        console.log(
          `  → generatedWhereClause: ${JSON.stringify(data.generatedWhereClause)}`,
        );

        expectInClause(data.generatedWhereClause);
      },
      30_000,
    );
  });
});
