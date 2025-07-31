#!/usr/bin/env tsx

import { config } from "dotenv";
import { writeFileSync } from "fs";
import { join } from "path";

// Load environment variables
config();

// Configuration
const CONFIG = {
  PPD_URL: "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-2025.txt",
  OUTPUT_FILE: join(process.cwd(), "layers/seed/server/utils/address-to-seed.ts"),
  MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
  CITIES: {
    CARDIFF: 250, // 125 for sale + 125 for rent
    SWANSEA: 250, // 125 for sale + 125 for rent
    NEWPORT: 250, // 125 for sale + 125 for rent
    BRISTOL: 250, // 125 for sale + 125 for rent
    LONDON: 250, // 125 for sale + 125 for rent
  },
  BATCH_SIZE: 20, // Process 20 addresses at a time
  DELAY_MS: 0, // No delay needed for batch requests
};

interface PPDRecord {
  id: string;
  price: number;
  date: string;
  postcode: string;
  propertyType: string;
  newBuild: string;
  tenure: string;
  number: string;
  flatNumber: string;
  street: string;
  locality: string;
  town: string;
  district: string;
  county: string;
  ppdCategory: string;
  recordStatus: string;
}

interface Address {
  number: string;
  street: string;
  city: string;
  postcode: string;
  fullAddress: string;
  lat: number;
  lon: number;
}

interface MapTilerResponse {
  results: Array<{
    features: Array<{
      center: [number, number];
    }>;
  }>;
}

// Utility functions
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const parseCSV = (line: string): string[] => {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
};

const parsePPDRecord = (line: string): PPDRecord | null => {
  const fields = parseCSV(line);
  if (fields.length < 16) return null;

  return {
    id: fields[0]?.replace(/[{}]/g, "") || "",
    price: parseInt(fields[1]) || 0,
    date: fields[2]?.replace(/"/g, "") || "",
    postcode: fields[3]?.replace(/"/g, "") || "",
    propertyType: fields[4]?.replace(/"/g, "") || "",
    newBuild: fields[5]?.replace(/"/g, "") || "",
    tenure: fields[6]?.replace(/"/g, "") || "",
    number: fields[7]?.replace(/"/g, "") || "",
    flatNumber: fields[8]?.replace(/"/g, "") || "",
    street: fields[9]?.replace(/"/g, "") || "",
    locality: fields[10]?.replace(/"/g, "") || "",
    town: fields[11]?.replace(/"/g, "") || "",
    district: fields[12]?.replace(/"/g, "") || "",
    county: fields[13]?.replace(/"/g, "") || "",
    ppdCategory: fields[14]?.replace(/"/g, "") || "",
    recordStatus: fields[15]?.replace(/"/g, "") || "",
  };
};

const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatAddress = (record: PPDRecord): string => {
  const parts: string[] = [];
  if (record.number) parts.push(record.number);
  if (record.flatNumber) parts.push(record.flatNumber);
  if (record.street) parts.push(toTitleCase(record.street));
  if (record.locality && record.locality !== record.town) parts.push(toTitleCase(record.locality));

  return parts.join(" ").trim();
};

const isValidCity = (record: PPDRecord, targetCity: string): boolean => {
  const city = targetCity.toUpperCase();
  const town = record.town?.toUpperCase() || "";
  const district = record.district?.toUpperCase() || "";
  const county = record.county?.toUpperCase() || "";

  // Special handling for different city variations
  if (city === "CARDIFF") {
    return town.includes("CARDIFF") || district.includes("CARDIFF") || county.includes("CARDIFF");
  } else if (city === "SWANSEA") {
    return town.includes("SWANSEA") || district.includes("SWANSEA") || county.includes("SWANSEA");
  } else if (city === "NEWPORT") {
    return town.includes("NEWPORT") || district.includes("NEWPORT");
  } else if (city === "BRISTOL") {
    return town.includes("BRISTOL") || district.includes("BRISTOL");
  } else if (city === "LONDON") {
    return (
      town.includes("LONDON") ||
      district.includes("LONDON") ||
      county.includes("GREATER LONDON") ||
      [
        "WESTMINSTER",
        "CAMDEN",
        "ISLINGTON",
        "HACKNEY",
        "TOWER HAMLETS",
        "GREENWICH",
        "LEWISHAM",
        "SOUTHWARK",
        "LAMBETH",
        "WANDSWORTH",
        "HAMMERSMITH",
        "KENSINGTON",
        "CHELSEA",
        "RICHMOND",
        "KINGSTON",
        "MERTON",
        "SUTTON",
        "CROYDON",
        "BROMLEY",
        "BEXLEY",
        "HAVERING",
        "BARKING",
        "REDBRIDGE",
        "NEWHAM",
        "WALTHAM FOREST",
        "HARINGEY",
        "ENFIELD",
        "BARNET",
        "HARROW",
        "HILLINGDON",
        "EALING",
        "HOUNSLOW",
      ].some((borough) => district.includes(borough))
    );
  }

  return town.includes(city) || district.includes(city);
};

const extractAddresses = async (): Promise<Record<string, Address[]>> => {
  console.log("📖 Fetching price paid data from Land Registry...");
  const response = await fetch(CONFIG.PPD_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch PPD data: ${response.status} ${response.statusText}`);
  }
  const content = await response.text();
  const lines = content.split("\n").filter((line) => line.trim());

  const addressesByCity: Record<string, Address[]> = {};

  // Initialize arrays for each city
  Object.keys(CONFIG.CITIES).forEach((city) => {
    addressesByCity[city] = [];
  });

  console.log(`📊 Processing ${lines.length} records...`);

  for (const line of lines) {
    if (!line.trim()) continue;

    const record = parsePPDRecord(line);
    if (!record || !record.street || !record.postcode) continue;

    // Check each city
    for (const city of Object.keys(CONFIG.CITIES)) {
      if (addressesByCity[city].length >= CONFIG.CITIES[city]) continue;

      if (isValidCity(record, city)) {
        const fullAddress = formatAddress(record);
        if (fullAddress && record.postcode) {
          addressesByCity[city].push({
            number: record.number || "",
            street: toTitleCase(record.street),
            city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
            postcode: record.postcode,
            fullAddress: `${fullAddress}, ${city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()}, ${record.postcode}`,
            lat: 0,
            lon: 0,
          });
        }
      }
    }

    // Check if we have enough addresses for all cities
    const allComplete = Object.keys(CONFIG.CITIES).every((city) => addressesByCity[city].length >= CONFIG.CITIES[city]);
    if (allComplete) break;
  }

  // Log results
  Object.keys(CONFIG.CITIES).forEach((city) => {
    console.log(`📍 ${city}: ${addressesByCity[city].length}/${CONFIG.CITIES[city]} addresses extracted`);
  });

  return addressesByCity;
};

const geocodeAddresses = async (addresses: Address[]): Promise<Address[]> => {
  console.log(`🌍 Geocoding ${addresses.length} addresses...`);
  const geocoded: Address[] = [];

  // Process in batches
  for (let i = 0; i < addresses.length; i += CONFIG.BATCH_SIZE) {
    const batch = addresses.slice(i, i + CONFIG.BATCH_SIZE);
    console.log(`🔄 Processing batch ${Math.floor(i / CONFIG.BATCH_SIZE) + 1}/${Math.ceil(addresses.length / CONFIG.BATCH_SIZE)}`);

    try {
      const results = await geocodeBatch(batch);
      geocoded.push(...results);

      // Add delay between batches to respect rate limits
      if (i + CONFIG.BATCH_SIZE < addresses.length) {
        await delay(CONFIG.DELAY_MS);
      }
    } catch (error) {
      console.error(`❌ Error geocoding batch: ${error instanceof Error ? error.message : "Unknown error"}`);
      // Add addresses with 0,0 coordinates as fallback
      geocoded.push(...batch);
    }
  }

  return geocoded;
};

const geocodeBatch = async (addresses: Address[]): Promise<Address[]> => {
  // Create semicolon-separated query string
  const queries = addresses.map((addr) => encodeURIComponent(addr.fullAddress)).join(";");
  const url = `https://api.maptiler.com/geocoding/${queries}.json?key=${CONFIG.MAPTILER_API_KEY}&country=gb`;

  const response = await fetch(url);
  const data = await response.json();

  if (Array.isArray(data)) {
    return addresses.map((addr, index) => {
      const result = data[index];
      if (result && result.features && result.features.length > 0) {
        const feature = result.features[0];
        if (feature && feature.center) {
          const [lon, lat] = feature.center;
          return { ...addr, lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) };
        }
      }
      return addr; // Keep original with 0,0 if geocoding failed
    });
  } else {
    throw new Error(`MapTiler API error: ${JSON.stringify(data)}`);
  }
};

const generateTypeScriptFile = (saleAddresses: Address[], rentalAddresses: Address[]): void => {
  console.log("🗑️  Clearing existing address arrays...");

  const template = `import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";

export const cityCenters: Prisma.AddressCreateWithoutPropertiesInput[] = [
  {
    street: "Queen Street",
    city: "Cardiff",
    postcode: "CF10 1FL",
    lat: 51.481583,
    lon: -3.17909,
  },
  {
    street: "St Mary Street",
    city: "Newport",
    postcode: "NP20 1JH",
    lat: 51.5849,
    lon: -2.9991,
  },
];

export const saleAddress: Prisma.AddressCreateWithoutPropertiesInput[] = [
${saleAddresses.map((addr) => `  { number: "${addr.number}", street: "${addr.street}", city: "${addr.city}", postcode: "${addr.postcode}", lat: ${addr.lat}, lon: ${addr.lon} },`).join("\n")}
];

export const rentalAddress: Prisma.AddressCreateWithoutPropertiesInput[] = [
${rentalAddresses.map((addr) => `  { number: "${addr.number}", street: "${addr.street}", city: "${addr.city}", postcode: "${addr.postcode}", lat: ${addr.lat}, lon: ${addr.lon} },`).join("\n")}
];
`;

  writeFileSync(CONFIG.OUTPUT_FILE, template);
  console.log(`✅ Generated fresh ${CONFIG.OUTPUT_FILE} with ${saleAddresses.length} sale and ${rentalAddresses.length} rental addresses`);
};

// Main execution
const main = async (): Promise<void> => {
  console.log("🚀 Starting address extraction and geocoding process...\n");

  // Validate API key
  if (!CONFIG.MAPTILER_API_KEY) {
    console.error("❌ MAPTILER_API_KEY not found in environment variables");
    process.exit(1);
  }

  try {
    // Step 1: Extract addresses from PPD data
    const addressesByCity = await extractAddresses();

    // Combine all addresses for geocoding
    const allAddresses = Object.values(addressesByCity).flat();
    console.log(`\n📊 Total addresses to geocode: ${allAddresses.length}`);

    // Step 2: Geocode all addresses
    const geocodedAddresses = await geocodeAddresses(allAddresses);

    // Step 3: Split into sale and rental addresses (50/50 split per city)
    const saleAddresses: Address[] = [];
    const rentalAddresses: Address[] = [];

    Object.keys(CONFIG.CITIES).forEach((city) => {
      const cityAddresses = geocodedAddresses.filter((addr) => addr.city.toUpperCase() === city.toUpperCase());

      const halfPoint = Math.floor(cityAddresses.length / 2);
      saleAddresses.push(...cityAddresses.slice(0, halfPoint));
      rentalAddresses.push(...cityAddresses.slice(halfPoint));
    });

    console.log(`\n📈 Sale addresses: ${saleAddresses.length}`);
    console.log(`🏠 Rental addresses: ${rentalAddresses.length}`);

    // Step 4: Generate TypeScript file
    generateTypeScriptFile(saleAddresses, rentalAddresses);

    console.log("\n🎉 Process completed successfully!");
    console.log(`📍 Geocoded ${geocodedAddresses.filter((addr) => addr.lat !== 0).length}/${geocodedAddresses.length} addresses`);
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    process.exit(1);
  }
};

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, extractAddresses, geocodeAddresses };
