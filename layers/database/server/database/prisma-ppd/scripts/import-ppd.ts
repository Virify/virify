// TODO: Move this import into a task or railway job
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

async function importPPDStream() {
  const client = new Client({
    connectionString: process.env.PPD_DATABASE_URL,
  });

  await client.connect();
  console.log("Connected to DB");

  const stream = client.query(
    copyFrom(`COPY price_paid (
  transaction_id, price, transfer_date, postcode, property_type, old_new, duration,
  paon, saon, street, locality, town_city, district, county, ppd_category, record_status
) FROM STDIN WITH (FORMAT csv, DELIMITER ',', HEADER false, QUOTE '"')`)
  );

  console.log("Starting download and streaming import...");

  const response = await fetch(LAND_REGISTRY_URL);
  if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

  await pipelineAsync(response.body!, stream);

  console.log("Import completed successfully");

  await client.end();
}

importPPDStream().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
