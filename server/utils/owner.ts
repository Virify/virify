import { Agent, Owner, OwnerRole } from "@prisma/client";

/**
 * Finds an owner by email.
 * @param email - The email of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwner(email: string): Promise<Owner | null> {
  return prisma.owner.findUnique({ where: { email } });
}

/**
 * Finds an owner by email and activation token.
 * @param email - The email of the owner to find.
 * @param token - The activation token of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwnerByToken(token: string): Promise<Owner | null> {
  return prisma.owner.findFirst({ where: { activationToken: token } });
}

/**
 * Finds an agent by email.
 * @param email - The email of the agent to find.
 * @returns The agent object if found, otherwise null.
 */
export async function findAgent(email: string): Promise<Agent | null> {
  const agentData = await prisma.owner.findFirst({
    include: { agents: { where: { email } } },
  });
  return agentData?.agents?.[0] || null;
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
      activationToken: token,
      tokenExpiry: new Date(Date.now() + 3600000),
    },
  });
}

/**
 * Update Owner Password and Activation.
 * @param userId number
 * @param password string
 * @returns Promise<Owner>
 */
export async function activateUser(userId: number, password: string): Promise<Owner> {
  return prisma.owner.update({
    where: { id: userId },
    data: {
      password,
      isActivated: true,
      activationToken: null,
      tokenExpiry: null,
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
      activationToken: token,
      tokenExpiry: new Date(Date.now() + 3600000),
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
export function isActive(user: Owner | Agent): boolean {
  return user.isActivated;
}
