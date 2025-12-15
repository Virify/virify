#!/usr/bin/env tsx
/**
 * Script to trigger admin password update via API endpoint
 * Usage: pnpm update-admin-password:remote
 * Railway: railway run pnpm update-admin-password:remote
 */

import { config } from "dotenv";
config();

async function updateAdminPasswordRemote() {
  try {
    const cfServiceTokenId = process.env.CF_SERVICE_TOKEN_ID;
    const cfServiceTokenSecret = process.env.CF_SERVICE_TOKEN_SECRET;
    const baseUrl = process.env.EMAIL_BASE_URL;

    if (!baseUrl) {
      console.error("base url required");
      process.exit(1);
    }

    if (!cfServiceTokenId || !cfServiceTokenSecret) {
      console.error("CF_SERVICE_TOKEN_ID and CF_SERVICE_TOKEN_SECRET environment variables are required");
      console.error("Create service token at: Cloudflare Zero Trust → Access → Service Auth → Service Tokens");
      process.exit(1);
    }

    const url = `${baseUrl}/auth/update-admin-password`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "virify-admin-update-script",
        "CF-Access-Client-Id": cfServiceTokenId,
        "CF-Access-Client-Secret": cfServiceTokenSecret,
      },
    });

    const result = await response.json();
    console.log("✅ Admin password update triggered successfully");
    console.log(result);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error triggering admin password update:", error.message);
    process.exit(1);
  }
}

updateAdminPasswordRemote();
