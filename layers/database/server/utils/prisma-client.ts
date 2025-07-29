import { PrismaClient as AppClient } from "~~/layers/database/server/database/prisma/generated/client";
import { PrismaClient as PpdClient } from "~~/layers/database/server/database/prisma-ppd/generated/client";

const config = useRuntimeConfig();

const appClientSingleton = () => {
  return new AppClient({
    datasources: {
      db: { url: config.DATABASE_URL },
    },
  });
};

const ppdClientSingleton = () => {
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

export const prisma = globalThis.prismaAppGlobal ?? appClientSingleton();
export const ppdPrisma = globalThis.prismaPpdGlobal ?? ppdClientSingleton();