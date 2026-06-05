<template>
  <div class="min-h-[60vh] flex items-center justify-center py-16 px-4">
    <div class="w-full max-w-lg">
      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-16">
        <UIcon name="i-lucide-loader" class="w-8 h-8 animate-spin text-muted" />
      </div>

      <!-- Already reviewed -->
      <template v-else-if="details?.alreadyReviewed">
        <div class="text-center space-y-5">
          <div
            class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto"
          >
            <UIcon
              name="i-lucide-info"
              class="w-10 h-10 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold">Already Reviewed</h1>
            <p class="text-muted">
              Listing
              <strong class="text-highlighted"
                >#{{ details.draftListingId }}</strong
              >
              has already been
              <strong>{{
                details.status === "APPROVED" ? "approved" : "denied"
              }}</strong
              >.
            </p>
          </div>
        </div>
      </template>

      <!-- Review form -->
      <template v-else-if="details && !actionTaken">
        <div class="space-y-6">
          <div class="text-center space-y-1">
            <h1 class="text-2xl font-bold">Review Ownership Submission</h1>
            <p class="text-muted text-sm">
              Listing
              <strong class="text-highlighted"
                >#{{ details.draftListingId }}</strong
              >
              &middot; Submitted {{ submittedAt }}
            </p>
          </div>

          <!-- Documents -->
          <div class="space-y-3">
            <p class="text-sm font-semibold">Submitted Documents</p>

            <a
              v-if="details.docOne?.hasFile"
              :href="docOneUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UIcon
                name="i-lucide-file-text"
                class="w-5 h-5 text-muted shrink-0"
              />
              <span class="text-sm truncate">{{
                details.docOne.name ?? "Document 1"
              }}</span>
              <UIcon
                name="i-lucide-external-link"
                class="w-4 h-4 text-muted ml-auto shrink-0"
              />
            </a>

            <a
              v-if="details.docTwo?.hasFile"
              :href="docTwoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UIcon
                name="i-lucide-file-text"
                class="w-5 h-5 text-muted shrink-0"
              />
              <span class="text-sm truncate">{{
                details.docTwo.name ?? "Document 2"
              }}</span>
              <UIcon
                name="i-lucide-external-link"
                class="w-4 h-4 text-muted ml-auto shrink-0"
              />
            </a>

            <p class="text-xs text-muted">
              Documents open in a new tab directly from secure storage.
            </p>
          </div>

          <USeparator />

          <!-- Actions -->
          <div class="flex gap-3">
            <UButton
              color="error"
              variant="outline"
              icon="i-lucide-shield-x"
              size="sm"
              class="flex-1 body-sm"
              :loading="acting === 'deny'"
              :disabled="!!acting"
              @click="act('deny')"
            >
              Deny
            </UButton>
            <UButton
              color="success"
              icon="i-lucide-shield-check"
              size="sm"
              class="flex-1 body-sm"
              :loading="acting === 'approve'"
              :disabled="!!acting"
              @click="act('approve')"
            >
              Approve
            </UButton>
          </div>
        </div>
      </template>

      <!-- Result after action -->
      <template v-else-if="actionTaken">
        <div class="text-center space-y-5">
          <div
            :class="[
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto',
              actionTaken === 'approve'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-red-100 dark:bg-red-900/30',
            ]"
          >
            <UIcon
              :name="
                actionTaken === 'approve'
                  ? 'i-lucide-shield-check'
                  : 'i-lucide-shield-x'
              "
              :class="[
                'w-10 h-10',
                actionTaken === 'approve'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400',
              ]"
            />
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold">
              {{
                actionTaken === "approve"
                  ? "Verification Approved"
                  : "Verification Denied"
              }}
            </h1>
            <p class="text-muted">
              Listing
              <strong class="text-highlighted"
                >#{{ details?.draftListingId }}</strong
              >
              has been {{ actionTaken === "approve" ? "approved" : "denied" }}.
              The submitted documents have been permanently deleted.
            </p>
          </div>
          <UAlert
            v-if="actionResult?.deletionWarning"
            icon="i-lucide-alert-triangle"
            color="warning"
            variant="soft"
            title="Storage warning"
            description="One or more documents could not be deleted from storage. Please check the server logs."
          />
        </div>
      </template>

      <!-- Error -->
      <template v-else>
        <div class="text-center space-y-5">
          <div
            class="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto"
          >
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-10 h-10 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold">Unable to load</h1>
            <p class="text-muted">
              {{
                (detailsError as any)?.statusMessage ||
                "This link may have expired or already been used."
              }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["authenticated"] });

const { isAdmin } = useFeatureFlag();

if (import.meta.client && !isAdmin.value) {
  await navigateTo("/");
}

const route = useRoute();
const token = route.params.token as string;
const toast = useToast();
const requestFetch = useRequestFetch();

type ReviewDetails =
  | { alreadyReviewed: true; status: string; draftListingId: number }
  | {
      alreadyReviewed: false;
      draftListingId: number;
      submittedAt: string;
      docOne: { name: string | null; hasFile: boolean };
      docTwo: { name: string | null; hasFile: boolean };
    };

const {
  data: details,
  error: detailsError,
  pending,
} = await useAsyncData("ownership-review-details", () =>
  requestFetch<ReviewDetails>("/api/ownership-verification/review-details", {
    query: { token },
  }),
);

// Proxy URLs — served through the authenticated server, no expiry
const docOneUrl = computed(
  () => `/api/ownership-verification/document?token=${token}&doc=one`,
);
const docTwoUrl = computed(
  () => `/api/ownership-verification/document?token=${token}&doc=two`,
);

const submittedAt = computed(() => {
  if (!details.value || details.value.alreadyReviewed) return "";
  return new Date(details.value.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const acting = ref<"approve" | "deny" | null>(null);
const actionTaken = ref<"approve" | "deny" | null>(null);
const actionResult = ref<{ deletionWarning: boolean } | null>(null);

async function act(action: "approve" | "deny") {
  acting.value = action;
  try {
    const result = await $fetch<{
      action: string;
      draftListingId: number;
      deletionWarning: boolean;
    }>("/api/ownership-verification/review", { query: { token, action } });
    actionResult.value = { deletionWarning: result.deletionWarning };
    actionTaken.value = action;
  } catch (err: any) {
    toast.add({
      title: "Action failed",
      description:
        err?.data?.statusMessage ??
        err?.statusMessage ??
        "Something went wrong.",
      color: "error",
      icon: "i-lucide-circle-x",
    });
  } finally {
    acting.value = null;
  }
}
</script>
