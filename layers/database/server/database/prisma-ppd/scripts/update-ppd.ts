/**
 * THIS IS SETUP AS A FUNCTION IN RAILWAY TO RUN MONTHLY VIA A SCHEDULED JOB.
 */
import { Client } from "pg";
import fetch from "node-fetch";
import { pipeline } from "stream";
import { promisify } from "util";
import dotenv from "dotenv";
import { from as copyFrom } from "pg-copy-streams";

dotenv.config();

const MONTHLY_UPDATE_URL =
  "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-monthly-update.txt";

const pipelineAsync = promisify(pipeline);

async function updatePPD() {
  console.log("Starting monthly PPD update...");
  console.log(`Data source: ${MONTHLY_UPDATE_URL}`);

  const client = new Client({
    // Change this in railway to point to the PPD database
    connectionString: process.env.PPD_DATABASE_URL,
  });

  await client.connect();
  console.log("Connected to DB");

  // Ensure tracking table exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS ppd_update_log (
      id SERIAL PRIMARY KEY,
      update_date TIMESTAMP NOT NULL DEFAULT NOW(),
      records_processed INTEGER NOT NULL,
      data_hash TEXT NOT NULL,
      CONSTRAINT unique_data_hash UNIQUE (data_hash)
    )
  `);

  // Fetch the data first to compute hash
  console.log("Fetching monthly update file...");
  const response = await fetch(MONTHLY_UPDATE_URL, {});
  if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
  
  const dataText = await response.text();
  
  // Create hash of the data to detect if it's the same file
  const crypto = await import("crypto");
  const dataHash = crypto.createHash("sha256").update(dataText).digest("hex");
  
  // Check if we've already processed this exact data
  const existingLog = await client.query(
    "SELECT id, update_date FROM ppd_update_log WHERE data_hash = $1",
    [dataHash]
  );
  
  if (existingLog.rows.length > 0) {
    console.log(`⚠️  This monthly update was already processed on ${existingLog.rows[0].update_date}`);
    console.log("No new data to import. Skipping update.");
    await client.end();
    return;
  }

  console.log("✅ New monthly update detected, proceeding with import...");

  // Create temporary table for monthly updates
  console.log("Creating temporary table...");
  await client.query(`
    CREATE TEMP TABLE price_paid_temp (LIKE price_paid INCLUDING ALL)
  `);

  const stream = client.query(
    copyFrom(`COPY price_paid_temp (
  transaction_id, price, transfer_date, postcode, property_type, old_new, duration,
  paon, saon, street, locality, town_city, district, county, ppd_category, record_status
) FROM STDIN WITH (FORMAT csv, DELIMITER ',', HEADER false, QUOTE '"')`)
  );

  console.log("Streaming monthly update to temporary table...");

  // Stream the data we already fetched
  const { Readable } = await import("stream");
  const dataStream = Readable.from([dataText]);
  
  await pipelineAsync(dataStream, stream);

  console.log("Merging monthly updates into main table...");
  // Use INSERT ON CONFLICT to handle upserts
  const result = await client.query(`
    INSERT INTO price_paid
    SELECT * FROM price_paid_temp
    ON CONFLICT (transaction_id) DO UPDATE SET
      price = EXCLUDED.price,
      transfer_date = EXCLUDED.transfer_date,
      postcode = EXCLUDED.postcode,
      property_type = EXCLUDED.property_type,
      old_new = EXCLUDED.old_new,
      duration = EXCLUDED.duration,
      paon = EXCLUDED.paon,
      saon = EXCLUDED.saon,
      street = EXCLUDED.street,
      locality = EXCLUDED.locality,
      town_city = EXCLUDED.town_city,
      district = EXCLUDED.district,
      county = EXCLUDED.county,
      ppd_category = EXCLUDED.ppd_category,
      record_status = EXCLUDED.record_status
  `);

  // Log this successful update
  await client.query(
    "INSERT INTO ppd_update_log (records_processed, data_hash) VALUES ($1, $2)",
    [result.rowCount || 0, dataHash]
  );

  console.log("Monthly PPD update completed successfully.");
  console.log(`Rows processed: ${result.rowCount}`);

  await client.end();
}

updatePPD().catch((e) => {
  console.error("PPD update failed:", e);
  process.exit(1);
});