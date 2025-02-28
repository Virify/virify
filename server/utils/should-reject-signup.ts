import { OwnerRole } from "@prisma/client";

export default function shouldRejectSignup(user: any): Boolean {
  return isActive(user) || hasRole(user, OwnerRole.AGENT)
};