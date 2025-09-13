import type { AuthUser } from "#auth-utils";
import { MembershipStatus, MembershipType } from "~~/layers/database/server/database/prisma/generated/enums";

export function useUserMembership() {
  /** shitty re-casting due to Nuxt Auth Utils and Prisma types both exporting User */
  const user = useUserSession().user.value as AuthUser;

  const isMember = computed(() => user.membershipActive === MembershipStatus.ACTIVE);

  const membershipType = computed<MembershipType | null>(() => user.membership ?? null);

  const membershipEndDate = computed<Date | null>(() => user.membershipEndDate ?? null);

  const userId = computed(() => user.id ?? null);

  return { 
    isMember, 
    membershipType,
    membershipEndDate, 
    userId 
  };
}
