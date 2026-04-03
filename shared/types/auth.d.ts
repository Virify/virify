import type { ActivationStatus, MembershipStatus, MembershipType, Role } from "../../layers/database/server/database/prisma/generated/enums";

declare module "#auth-utils" {
  interface User {
    id: number;
    email?: string;
    username?: string;
    membership: MembershipType;
    membershipActive?: MembershipStatus;
    membershipEndDate?: Date | null;
    role?: Role;
    activated?: ActivationStatus;
    avatar?: string;
  }
}
