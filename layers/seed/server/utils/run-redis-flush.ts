#!/usr/bin/env tsx
/**
 * Script to flush all Redis keys (full cache reset)
 * Usage:  pnpm redis:flush
 * Railway: railway run pnpm redis:flush
 *
 * Connection resolution order:
 *   REDIS_PUBLIC_URL  — use when running locally or via `railway run` (outside Railway network)
 *   REDIS_URL         — automatically available inside Railway containers (private network)
 *   REDISHOST / REDISPORT / REDISPASSWORD / REDISUSER  — individual var fallback
 */

import { config } from "dotenv";
config();

import Redis from "ioredis";

async function flushRedis() {
  // Prefer public URL when outside Railway's private network.
  // Inside Railway (SSH/deployed), REDIS_URL uses the private hostname and is fine.
  const url = process.env.REDIS_PUBLIC_URL || process.env.REDIS_URL;
  const host = process.env.REDISHOST;
  const port = process.env.REDISPORT ? parseInt(process.env.REDISPORT) : 6379;
  const password = process.env.REDISPASSWORD;
  const username = process.env.REDISUSER;

  if (!url && !host) {
    console.error("No Redis connection configured.");
    console.error("  Inside Railway: REDIS_URL is injected automatically.");
    console.error("  Outside Railway: set REDIS_PUBLIC_URL in your .env");
    process.exit(1);
  }

  const redis = url
    ? new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 5000 })
    : new Redis({ host, port, password, username, maxRetriesPerRequest: 1, connectTimeout: 5000 });

  try {
    await redis.flushall();
    console.log("Redis flushed successfully (FLUSHALL)");
    process.exit(0);
  } catch (error: any) {
    console.error("Failed to flush Redis:", error.message);
    process.exit(1);
  } finally {
    redis.disconnect();
  }
}

flushRedis();
