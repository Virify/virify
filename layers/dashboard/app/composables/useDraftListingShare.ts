/**
 * Manages shared user add/remove for a single draft listing.
 * Owns all API calls and keeps the shared users list up to date from responses.
 */
export function useDraftListingShare(
  draftListingId: number | undefined,
  initialSharedUsers: SharedUser[],
) {
  const requestFetch = useRequestFetch();

  const sharedUsers = ref<SharedUser[]>(initialSharedUsers);
  const emailError = ref("");
  const isSubmitting = ref(false);
  const removingIds = ref(new Set<number>());

  async function addUser(email: string): Promise<boolean> {
    if (!draftListingId) return false;

    isSubmitting.value = true;
    emailError.value = "";

    try {
      const result = await requestFetch<{
        success: boolean;
        sharedUsers: SharedUser[];
      }>(`/api/draft-listings/${draftListingId}/share`, {
        method: "POST",
        body: { email },
      });

      sharedUsers.value = result.sharedUsers;
      return true;
    } catch (err: any) {
      emailError.value =
        err?.data?.message ?? "Something went wrong. Please try again.";
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function removeUser(userId: number): Promise<void> {
    if (!draftListingId) return;

    removingIds.value = new Set(removingIds.value).add(userId);

    try {
      const result = await requestFetch<{
        success: boolean;
        sharedUsers: SharedUser[];
      }>(`/api/draft-listings/${draftListingId}/share`, {
        method: "DELETE",
        body: { userId },
      });

      sharedUsers.value = result.sharedUsers;
    } finally {
      const next = new Set(removingIds.value);
      next.delete(userId);
      removingIds.value = next;
    }
  }

  return {
    sharedUsers,
    emailError,
    isSubmitting,
    removingIds,
    addUser,
    removeUser,
  };
}
