import { useDocumentVisibility } from "@vueuse/core";

/**
 * useOwnershipVerification(draftListingId)
 *
 * Per-listing ownership verification composable.
 * Pass a reactive draftListingId to track/submit verification for a specific draft.
 */
export function useOwnershipVerification(draftListingId: Ref<number | null>) {
  const { isAdmin, isAgent } = useRole();
  const requestFetch = useRequestFetch();
  const toast = useToast();

  type VerificationRecord = {
    id: number;
    status: string;
    createdAt: string;
    reviewedAt: string | null;
  };

  // undefined = not yet fetched, null = fetched but no record exists
  const record = ref<VerificationRecord | null | undefined>(undefined);
  const loading = ref(false);

  // AGENT and ADMIN bypass ownership verification entirely
  const isExempt = computed(() => isAdmin.value || isAgent.value);

  const isApproved = computed(() => record.value?.status === "APPROVED");
  const isPending = computed(() => record.value?.status === "PENDING");
  const isDenied = computed(() => record.value?.status === "DENIED");
  const hasSubmitted = computed(
    () => record.value !== null && record.value !== undefined,
  );

  async function refresh() {
    if (isExempt.value || !draftListingId.value) return;
    loading.value = true;
    try {
      const res = await requestFetch<{ record: VerificationRecord | null }>(
        `/api/ownership-verification/status?draftId=${draftListingId.value}`,
      );
      record.value = res.record ?? null;
    } catch (e) {
      console.error("[useOwnershipVerification] Failed to fetch status", e);
    } finally {
      loading.value = false;
    }
  }

  // Re-fetch whenever the draftListingId changes
  watch(draftListingId, () => {
    record.value = undefined;
  });

  // Re-fetch when the user returns to the tab while status is PENDING
  // (admin may have approved/denied via email link in another tab)
  if (import.meta.client) {
    const visibility = useDocumentVisibility();
    watch(visibility, (state) => {
      if (state === "visible" && isPending.value) {
        refresh();
      }
    });
  }

  async function uploadDoc(
    file: File,
  ): Promise<{ key: string; originalName: string } | null> {
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await requestFetch<{
        success: boolean;
        key: string;
        originalName: string;
      }>("/api/ownership-verification/upload", { method: "POST", body: form });
      return { key: res.key, originalName: res.originalName };
    } catch (err: any) {
      toast.add({
        title: "Upload failed",
        description:
          err?.data?.message ??
          err?.statusMessage ??
          "Could not upload document",
        color: "error",
        icon: "i-lucide-circle-x",
      });
      return null;
    }
  }

  async function submit(
    docOneKey: string,
    docOneName: string,
    docTwoKey: string,
    docTwoName: string,
  ): Promise<boolean> {
    if (!draftListingId.value) return false;
    try {
      await requestFetch("/api/ownership-verification/submit", {
        method: "POST",
        body: {
          draftListingId: draftListingId.value,
          docOneKey,
          docOneName,
          docTwoKey,
          docTwoName,
        },
      });
      await refresh();
      return true;
    } catch (err: any) {
      toast.add({
        title: "Submission failed",
        description:
          err?.data?.message ??
          err?.statusMessage ??
          "Could not submit verification",
        color: "error",
        icon: "i-lucide-circle-x",
      });
      return false;
    }
  }

  return {
    record,
    loading,
    isExempt,
    isApproved,
    isPending,
    isDenied,
    hasSubmitted,
    refresh,
    uploadDoc,
    submit,
  };
}
