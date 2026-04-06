#!/usr/bin/env tsx
/**
 * Script to flush all Redis keys (full cache reset)
 * Usage:  pnpm redis:flush
 * Railway: railway run pnpm redis:flush
 *
 * Reads connection details from env vars (same as nuxt.config.ts):
 *   REDIS_URL          — full Redis URL (takes precedence)
 *   REDISHOST / REDISPORT / REDISPASSWORD / REDISUSER  — individual vars
 */

import { config } from "dotenv";
config();

import Redis from "ioredis";

async function flushRedis() {
  const url = process.env.REDIS_URL;
  const host = process.env.REDISHOST;
  const port = process.env.REDISPORT ? parseInt(process.env.REDISPORT) : 6379;
  const password = process.env.REDISPASSWORD;
  const username = process.env.REDISUSER;

  if (!url && !host) {
    console.error("No Redis connection configured. Set REDIS_URL or REDISHOST.");
    process.exit(1);
  }

  const redis = url
    ? new Redis(url)
    : new Redis({ host, port, password, username });

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
