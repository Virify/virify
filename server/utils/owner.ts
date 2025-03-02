import { Agent, Owner, OwnerRole, Prisma, Reviewed } from "@prisma/client";

/**
 * Finds an owner by email.
 * @param email - The email of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwner(email: string): Promise<Owner | null> {
  return prisma.owner.findUnique({
    where: {
      email,
    },
  });
}

export async function findOwnerWithVerification(email: string): Promise<Prisma.OwnerGetPayload<{ include: { verification: true } }> | null> {
  return prisma.owner.findUnique({
    where: {
      email,
    },
    include: {
      verification: true,
    },
  });
}

/**
 * Finds an owner by email and activation token.
 * @param email - The email of the owner to find.
 * @param token - The activation token of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwnerByToken(token: string): Promise<Prisma.OwnerGetPayload<{ include: { verification: true } }> | null> {
  return prisma.owner.findFirst({
    where: {
      verification: {
        is: { activationToken: token }
      },
    },
    include: {
      verification: true
    },
  });
}

/**
 * Finds an owner by email, business name, and registration number.
 * @param email - The email of the owner to find.
 * @param businessName - The business name of the owner to find.
 * @param registrationNumber - The registration number of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findBusinessOwner(email: string, businessName: string, registrationNumber: string): Promise<Prisma.OwnerGetPayload<{ include: { verification: true } }> | null> {
  return prisma.owner.findFirst({
    where: {
      OR: [{ email }, { businessName }, { companyRegistration: registrationNumber }],
    },
    include: {
      verification: true
    },
  });
}
/**
 * Finds an agent by email.
 * @param email - The email of the agent to find.
 * @returns The agent object if found, otherwise null.
 */
export async function findAgent(email: string): Promise<Owner | null> {
  return prisma.owner.findFirst({
    where: {
      agents: {
        some: { email }
      }
    },
    include: { agents: true, verification: true },
  });
}

/**
 * Deletes an owner by email.
 * @param email string
 * @returns Promise<Owner>
 */
export async function deleteOwner(id: number): Promise<Owner> {
  return prisma.owner.delete({ where: { id } });
}
/**
 * Create a new owner with the given email and token.
 * @param email string
 * @param token string
 * @returns Owner <Promise>
 */
export async function createOwnerWithToken(email: string, token: string): Promise<Owner> {
  return prisma.owner.create({
    data: {
      email,
      verification: {
        create: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
  });
}

/**
 * Create an owner with the given email.
 * @param email string
 * @returns Promise<Owner>
 */
export async function createOauthOwner(email: string): Promise<Owner> {
  return prisma.owner.create({ data: { email } });
}

/**
 * Create owner as agent
 * @param email string
 * @param businessName string
 * @param mainContact string
 * @param addressLine string
 * @param city string
 * @param county string
 * @param country string
 * @param postcode string
 * @param registrationNumber string
 * @returns Promise<Owner>
 */
export async function createBusinessOwner(email: string, businessName: string, mainContact: string, addressLine: string, city: string, county: string, country: string, postcode: string, registrationNumber: string): Promise<Owner> {
  return prisma.owner.create({
    data: {
      email,
      businessName,
      mainContact,
      addressLine1: addressLine,
      city,
      county,
      country,
      postcode,
      companyRegistration: registrationNumber,
      role: OwnerRole.AGENT,
      verification: {
        create: {
          reviewed: Reviewed.PENDING,
        },
      },
    },
  });
}

/**
 * Update Owner Token and Expiry.
 * @param email string
 * @param token string
 * @returns Promise<Owner>
 */
export async function updateOwnerToken(email: string, token: string): Promise<Owner> {
  return prisma.owner.update({
    where: { email },
    data: {
      verification: {
        update: {
          activationToken: token,
          activationTokenExpiry: new Date(Date.now() + 3600000),
        },
      },
    },
  });
}

/**
 * Update Owner Password and Activation.
 * @param userId number
 * @param password string
 * @returns Promise<Owner>
 */
export async function updateOwnerAndActivate(userId: number, password: string): Promise<Owner> {
  return prisma.owner.update({
    where: { id: userId },
    data: {
      password,
      verification: {
        update: {
          activationToken: null,
          activationTokenExpiry: null,
          activated: true,
        },
      },
    },
  });
}

/**
 * Check for the role of the owner.
 * @param user Owner | Agent
 * @param role OwnerRole
 * @returns Boolean
 */
export function hasRole(user: Owner | Agent, role: OwnerRole): boolean {
  return user.role === role;
}

/**
 * Check if a owner is active.
 * @param user Owner | Agent
 * @returns Boolean
 */
export function isActive(user: Prisma.OwnerGetPayload<{ include: { verification: true } }>): boolean {
  return user.verification?.activated === true;
}
