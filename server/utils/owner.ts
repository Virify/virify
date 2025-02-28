import { Agent, Owner } from "@prisma/client";

/**
 * Finds an owner by email.
 * @param email - The email of the owner to find.
 * @returns The owner object if found, otherwise null.
 */
export async function findOwner(email: string): Promise<Owner | null> {
  return prisma.owner.findUnique({ where: { email } });
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
