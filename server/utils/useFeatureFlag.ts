import type { H3Event, EventHandlerRequest } from "h3";
import { useRole } from "./useRole";

export async function useFeatureFlag(event: H3Event<EventHandlerRequest>) {
  const flags = getFeatureFlagConfig();
  const { role, roleActive, isAdmin, isAgent } = await useRole(event);

  // ADMIN, AGENT, and USER (subject to ownership verification) can create a listing
  const createListing: boolean =
    role === "ADMIN" ||
    !!(flags.createListing && (role === "AGENT" || role === "USER"));

  return {
    ...flags,
    createListing,
    role,
    roleActive,
    isAdmin,
    isAgent,
    checkFeatureFlag,
  };
}
