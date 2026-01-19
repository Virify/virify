
import { MembershipStatus, MembershipType } from "~~/layers/database/server/database/prisma/generated/enums";

export function useUserMembership() {
  const { user } = useUserSession();

  const isMember = computed(() => user.value?.membershipActive === MembershipStatus.ACTIVE);

  const membershipType = computed<MembershipType>(() => user.value?.membership ?? MembershipType.FREE);

  const membershipEndDate = computed<Date | null>(() => user.value?.membershipEndDate ?? null);

  // Numeric rank for the current user's membership (-1 when unknown)
  const membershipRank = computed<number>(() => {
    const userTier = membershipType.value?.toLowerCase();
    switch (userTier) {
      case 'basic':
        return 0;
      case 'featured':
        return 1;
      case 'premium':
        return 2;
      default:
        return -1;
    }
  });

  /**
   * Check if a given tier is included in the user's membership
   * @param tier TierOption
   */
  const isIncludedInMembership = (tier: TierOption): boolean => {
    const userRank = membershipRank.value;
    if (userRank === -1) return false;
    return userRank >= tier.rank;
  };

  /**
   * Check if the user should be offered a membership upgrade for the requested tier.
   * Returns true when the user currently has a membership but its rank is lower than the tier.
   */
  const needsMembershipUpgrade = (tier: TierOption): boolean => {
    const userRank = membershipRank.value;
    return userRank >= 0 && userRank < tier.rank;
  };

  /**
   * Placeholder: trigger membership upgrade flow. Implementation left intentionally blank.
   */
  const requestMembershipUpgrade = async (targetTier: TierOption) => {
    // TODO: implement membership upgrade flow (billing / plan change)
    // For now just log and return
    console.log('requestMembershipUpgrade called for', targetTier);
    return;
  };

  return { 
    isMember, 
    membershipType,
    membershipEndDate,
    membershipRank,
    isIncludedInMembership,
    needsMembershipUpgrade,
    requestMembershipUpgrade,
  };
}
