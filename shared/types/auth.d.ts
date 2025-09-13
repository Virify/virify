import type { MembershipStatus, MembershipType } from "../../layers/database/server/database/prisma/generated/enums";

declare module "#auth-utils" {
  interface AuthUser {
    id: number;
    email?: string,
    username?: string;
    membership: MembershipType
    membershipActive?: MembershipStatus;
    membershipEndDate?: Date | null;
  }

  export { AuthUser }
}
