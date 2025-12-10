/**
 * THIS IS SETUP AS A FUNCTION IN RAILWAY TO RUN MONTHLY VIA A SCHEDULED JOB.
 */
import { createHash } from "crypto";
import { readFile, unlink } from "fs/promises";
import { createWriteStream, createReadStream } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import dotenv from "dotenv";
import pg from "pg";
import copyFrom from "pg-copy-streams";

dotenv.config();

const { Client } = pg;
const { from } = copyFrom;

const MONTHLY_UPDATE_URL =
  "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-monthly-update.txt";

async function updatePPD() {
  const tmpFile = join(tmpdir(), `ppd-update-${Date.now()}.txt`);
  const startTime = Date.now();
  
  console.log("Starting monthly PPD update...");
  console.log(`Data source: ${MONTHLY_UPDATE_URL}`);

  const client = new Client({
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

  try {
    // Download using fetch to disk first
    console.log("Downloading monthly update file...");
    const response = await fetch(MONTHLY_UPDATE_URL);
    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fileStream = createWriteStream(tmpFile);
    await pipeline(Readable.fromWeb(response.body as any), fileStream);
    console.log("✅ Download complete");
    
    // Read file and compute hash for duplicate detection
    const dataText = await readFile(tmpFile, 'utf-8');
    const dataHash = createHash("sha256").update(dataText).digest("hex");
    
    // Check if already processed
    const existingLog = await client.query(
      "SELECT id, update_date FROM ppd_update_log WHERE data_hash = $1",
      [dataHash]
    );
    
    if (existingLog.rows.length > 0) {
      console.log(`⚠️  This monthly update was already processed on ${existingLog.rows[0].update_date}`);
      console.log("No new data to import. Skipping update.");
      await client.end();
      await unlink(tmpFile);
      return;
    }

    console.log("✅ New monthly update detected, proceeding with import...");

    // Create temporary table
    console.log("Creating temporary table...");
    await client.query(`
      CREATE TEMP TABLE price_paid_temp (LIKE price_paid INCLUDING ALL)
    `);

    // Import using pg-copy-streams from disk (fast)
    console.log("Importing to temporary table with COPY...");
    const copyQuery = `
      COPY price_paid_temp (transaction_id, price, transfer_date, postcode, property_type, old_new, duration, paon, saon, street, locality, town_city, district, county, ppd_category, record_status)
      FROM STDIN WITH (FORMAT csv, DELIMITER ',', HEADER false, QUOTE '"')
    `;

    const stream = client.query(from(copyQuery));
    const fileReadStream = createReadStream(tmpFile);
    await pipeline(fileReadStream, stream);
    
    console.log("✅ Import to temp table complete");

    // Merge into main table
    console.log("Merging monthly updates into main table...");
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

    // Log successful update
    await client.query(
      "INSERT INTO ppd_update_log (records_processed, data_hash) VALUES ($1, $2)",
      [result.rowCount || 0, dataHash]
    );

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log(`✅ Monthly PPD update completed successfully in ${totalTime} minutes`);
    console.log(`Rows processed: ${result.rowCount}`);

    await client.end();
    
    // Clean up
    await unlink(tmpFile);
    
  } catch (error: any) {
    console.error('Update failed:', error.message);
    await client.end();
    // Clean up on error
    try {
      await unlink(tmpFile);
    } catch {}
    throw error;
  }
}

export default updatePPD;

// For running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePPD().catch((e) => {
    console.error("PPD update failed:", e);
    process.exit(1);
  });
}