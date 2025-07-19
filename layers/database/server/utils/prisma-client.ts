import { PrismaClient } from "~~/layers/database/server/database/prisma/generated/client";

const config = useRuntimeConfig();

// Create a PrismaClient instance with the database URL from runtime config
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: config.DATABASE_URL,
      },
    },
  });
};

// Use a global variable to ensure a single PrismaClient instance in development
declare const globalThis: {
  prismaGlobal?: PrismaClient;
};

// Create or reuse the PrismaClient instance
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
