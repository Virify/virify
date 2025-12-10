/**
 * This is setup as a function in railwauy to trigger ONCE
 */
import { Client } from "pg";
import fetch from "node-fetch";
import { pipeline } from "stream";
import { promisify } from "util";
import dotenv from "dotenv";
import { from as copyFrom } from "pg-copy-streams";

dotenv.config();

const LAND_REGISTRY_URL =
  "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-complete.txt";

const pipelineAsync = promisify(pipeline);

export default async function importPPDStream() {
  const client = new Client({
    // change this in railway to point to the PPD database
    connectionString: process.env.PPD_DATABASE_URL,
  });

  await client.connect();
  console.log("Connected to DB");

  console.log("Starting COPY command...");
  const stream = client.query(
    copyFrom(`COPY price_paid (
  transaction_id, price, transfer_date, postcode, property_type, old_new, duration,
  paon, saon, street, locality, town_city, district, county, ppd_category, record_status
) FROM STDIN WITH (FORMAT csv, DELIMITER ',', HEADER false, QUOTE '"')`)
  );

  console.log("Fetching data from Land Registry...");
  const response = await fetch(LAND_REGISTRY_URL, {});
  if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

  console.log("Starting streaming import (this will take 30-60 minutes)...");
  
  // Simple progress logging
  let bytesProcessed = 0;
  const startTime = Date.now();
  
  const progressInterval = setInterval(() => {
    const mb = (bytesProcessed / 1024 / 1024).toFixed(2);
    const mins = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`Progress: ${mb} MB processed (${mins} mins)`);
  }, 30000); // Log every 30 seconds
  
  response.body!.on('data', (chunk) => {
    bytesProcessed += chunk.length;
  });

  response.body!.on('error', (err) => {
    console.error('Response body error:', err);
  });

  stream.on('error', (err) => {
    console.error('COPY stream error:', err);
  });

  try {
    await pipelineAsync(response.body!, stream);
  } catch (error) {
    clearInterval(progressInterval);
    console.error('Pipeline error:', error);
    throw error;
  }
  
  clearInterval(progressInterval);

  console.log("Import completed successfully");
  console.log(`Total: ${(bytesProcessed / 1024 / 1024).toFixed(2)} MB in ${((Date.now() - startTime) / 1000 / 60).toFixed(2)} minutes`);

  await client.end();
  
  return {
    success: true,
    dataSizeMB: parseFloat((bytesProcessed / 1024 / 1024).toFixed(2))
  };
}

// For running directly via tsx (not as Railway Function)
if (import.meta.url === `file://${process.argv[1]}`) {
  importPPDStream().catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  });
}
