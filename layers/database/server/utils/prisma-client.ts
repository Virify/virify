import { PrismaClient as AppClient } from "~~/layers/database/server/database/prisma/generated/client";
import { PrismaClient as PpdClient } from "~~/layers/database/server/database/prisma-ppd/generated/client";
import { PrismaClient as WaitingListClient } from "~~/layers/database/server/database/prisma-waiting-list/generated/client";
import { PrismaPg } from '@prisma/adapter-pg';

const appClientSingleton = () => {
  // Get config at runtime, not module load time
  const config = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : {
    DATABASE_URL: process.env.DATABASE_URL,
    PPD_DATABASE_URL: process.env.PPD_DATABASE_URL,
  };

  return new AppClient({
    adapter: new PrismaPg({ connectionString: config.DATABASE_URL }),
  });
};

const ppdClientSingleton = () => {
  // Get config at runtime, not module load time
  const config = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : {
    DATABASE_URL: process.env.DATABASE_URL,
    PPD_DATABASE_URL: process.env.PPD_DATABASE_URL,
  };

  return new PpdClient({
    adapter: new PrismaPg({ connectionString: config.PPD_DATABASE_URL }),
  });
};

const waitingListClientSingleton = () => {
  // Get config at runtime, not module load time
  const config = typeof useRuntimeConfig !== 'undefined' ? useRuntimeConfig() : {
    DATABASE_URL: process.env.DATABASE_URL,
    WAITING_LIST_DATABASE_URL: process.env.WAITING_LIST_DATABASE_URL,
  };

  return new WaitingListClient({
    adapter: new PrismaPg({ connectionString: config.WAITING_LIST_DATABASE_URL }),
  });
};

declare const globalThis: {
  prismaAppGlobal?: AppClient;
  prismaPpdGlobal?: PpdClient;
  prismaWaitingListGlobal?: WaitingListClient;
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

export const waitingListPrisma = new Proxy({} as WaitingListClient, {
  get(target, prop) {
    if (!globalThis.prismaWaitingListGlobal) {
      globalThis.prismaWaitingListGlobal = waitingListClientSingleton();
    }
    return (globalThis.prismaWaitingListGlobal as any)[prop];
  }
});