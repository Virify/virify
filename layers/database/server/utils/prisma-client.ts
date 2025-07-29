import { PrismaClient as AppClient } from "~~/layers/database/server/database/prisma/generated/client";
import { PrismaClient as PpdClient } from "~~/layers/database/server/database/prisma-ppd/generated/client";

const appClientSingleton = () => {
  // Get config at runtime, not module load time
  const config = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : {
    DATABASE_URL: process.env.DATABASE_URL,
    PPD_DATABASE_URL: process.env.PPD_DATABASE_URL,
  };

  return new AppClient({
    datasources: {
      db: { url: config.DATABASE_URL },
    },
  });
};

const ppdClientSingleton = () => {
  // Get config at runtime, not module load time
  const config = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : {
    DATABASE_URL: process.env.DATABASE_URL,
    PPD_DATABASE_URL: process.env.PPD_DATABASE_URL,
  };

  return new PpdClient({
    datasources: {
      ppdDb: { url: config.PPD_DATABASE_URL },
    },
  });
};

declare const globalThis: {
  prismaAppGlobal?: AppClient;
  prismaPpdGlobal?: PpdClient;
};

// Export lazy-initialized clients
export const prisma = new Proxy({} as AppClient, {
  get(target, prop) {
    if (!globalThis.prismaAppGlobal) {
      globalThis.prismaAppGlobal = appClientSingleton();
    }
    return (globalThis.prismaAppGlobal as any)[prop];
  }
});

export const ppdPrisma = new Proxy({} as PpdClient, {
  get(target, prop) {
    if (!globalThis.prismaPpdGlobal) {
      globalThis.prismaPpdGlobal = ppdClientSingleton();
    }
    return (globalThis.prismaPpdGlobal as any)[prop];
  }
});