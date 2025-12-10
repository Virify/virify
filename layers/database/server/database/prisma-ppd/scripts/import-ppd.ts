/**
 * This is setup as a function in railway to trigger ONCE
 */
import { createWriteStream, createReadStream } from "fs";
import { stat, unlink } from "fs/promises";
import { pipeline } from "stream/promises";
import dotenv from "dotenv";
import { tmpdir } from "os";
import { join } from "path";
import { Readable } from "stream";
import pg from "pg";
import copyFrom from "pg-copy-streams";

dotenv.config();

const { Client } = pg;
const { from } = copyFrom;

const LAND_REGISTRY_URL = "http://prod.publicdata.landregistry.gov.uk.s3-website-eu-west-1.amazonaws.com/pp-complete.txt";

export default async function importPPDStream() {
  const tmpFile = join(tmpdir(), `ppd-import-${Date.now()}.txt`);
  const startTime = Date.now();
  
  console.log("Downloading PPD data file...");
  const downloadStart = Date.now();

  try {
    // Download using fetch to disk first (solves HTTP streaming bottleneck)
    const response = await fetch(LAND_REGISTRY_URL);
    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const fileStream = createWriteStream(tmpFile);
    await pipeline(Readable.fromWeb(response.body as any), fileStream);

    const downloadTime = ((Date.now() - downloadStart) / 1000 / 60).toFixed(2);
    console.log(`✅ Download complete in ${downloadTime} minutes`);

    // Get file size
    const fileStats = await stat(tmpFile);
    const fileSizeMB = (fileStats.size / 1024 / 1024).toFixed(2);
    console.log(`File size: ${fileSizeMB} MB`);

    // Import using pg-copy-streams from disk (fast)
    console.log("Connecting to database...");
    const importStart = Date.now();

    const client = new Client({
      connectionString: process.env.PPD_DATABASE_URL,
    });
    await client.connect();

    // Drop indexes before bulk import (massive performance improvement)
    console.log("Dropping indexes temporarily...");
    await client.query(`DROP INDEX IF EXISTS "price_paid_postcode_idx"`);
    await client.query(`DROP INDEX IF EXISTS "price_paid_postcode_paon_street_town_city_county_idx"`);
    await client.query(`DROP INDEX IF EXISTS "price_paid_transfer_date_idx"`);
    await client.query(`DROP INDEX IF EXISTS "price_paid_price_idx"`);
    console.log("✅ Indexes dropped");

    console.log("Importing to database with COPY...");
    const copyQuery = `
      COPY price_paid (transaction_id, price, transfer_date, postcode, property_type, old_new, duration, paon, saon, street, locality, town_city, district, county, ppd_category, record_status)
      FROM STDIN WITH (FORMAT csv, DELIMITER ',', HEADER false, QUOTE '"')
    `;

    const stream = client.query(from(copyQuery));
    const fileReadStream = createReadStream(tmpFile);
    
    await pipeline(fileReadStream, stream);
    console.log("✅ Data import complete");

    // Recreate indexes after import (builds them efficiently in one pass)
    console.log("Recreating indexes (this may take 5-10 minutes)...");
    const indexStart = Date.now();
    
    await client.query(`CREATE INDEX "price_paid_postcode_idx" ON "price_paid"("postcode")`);
    console.log("  ✅ Postcode index created");
    
    await client.query(`CREATE INDEX "price_paid_postcode_paon_street_town_city_county_idx" ON "price_paid"("postcode", "paon", "street", "town_city", "county")`);
    console.log("  ✅ Composite index created");
    
    await client.query(`CREATE INDEX "price_paid_transfer_date_idx" ON "price_paid"("transfer_date")`);
    console.log("  ✅ Transfer date index created");
    
    await client.query(`CREATE INDEX "price_paid_price_idx" ON "price_paid"("price")`);
    console.log("  ✅ Price index created");
    
    const indexTime = ((Date.now() - indexStart) / 1000 / 60).toFixed(2);
    console.log(`✅ All indexes recreated in ${indexTime} minutes`);

    await client.end();

    const importTime = ((Date.now() - importStart) / 1000 / 60).toFixed(2);
    console.log(`✅ Import complete in ${importTime} minutes`);

    // Clean up
    console.log("Cleaning up temporary file...");
    await unlink(tmpFile);

    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    console.log(`✅ Total time: ${totalTime} minutes`);

    return {
      success: true,
      downloadMinutes: parseFloat(downloadTime),
      importMinutes: parseFloat(importTime),
      totalMinutes: parseFloat(totalTime),
    };
  } catch (error: any) {
    console.error("Import failed:", error.message);
    // Try to clean up on error
    try {
      await unlink(tmpFile);
    } catch {}
    throw error;
  }
}

// For running directly via tsx (not as Railway Function)
if (import.meta.url === `file://${process.argv[1]}`) {
  importPPDStream().catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  });
}
