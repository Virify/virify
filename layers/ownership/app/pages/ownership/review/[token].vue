<template>
  <div
    class="| container container-2xs flow flow-lg"
    style="text-align: center; padding-top: 4rem"
  >
    <!-- Approved -->
    <template v-if="data && isApprove">
      <UIcon
        name="i-lucide-check-circle"
        style="width: 3rem; height: 3rem; color: #16a34a; margin: 0 auto"
      />
      <h1 class="| title-xl">Verification Approved</h1>
      <p class="| body-md">
        Listing <strong>#{{ data.draftListingId }}</strong> has been marked as
        fully verified. The owner can now publish their listing.
      </p>
      <p v-if="data.deletionWarning" class="| body-sm" style="color: #b45309">
        ⚠️ One or more documents could not be deleted from storage. Please check
        the server logs.
      </p>
    </template>

    <!-- Denied -->
    <template v-else-if="data && !isApprove">
      <UIcon
        name="i-lucide-x-circle"
        style="width: 3rem; height: 3rem; color: #dc2626; margin: 0 auto"
      />
      <h1 class="| title-xl">Verification Denied</h1>
      <p class="| body-md">
        Listing <strong>#{{ data.draftListingId }}</strong> has been denied. The
        user can re-submit their documents from their dashboard.
      </p>
      <p v-if="data.deletionWarning" class="| body-sm" style="color: #b45309">
        ⚠️ One or more documents could not be deleted from storage. Please check
        the server logs.
      </p>
    </template>

    <!-- Error -->
    <template v-else>
      <UIcon
        name="i-lucide-alert-triangle"
        style="width: 3rem; height: 3rem; color: #b45309; margin: 0 auto"
      />
      <h1 class="| title-xl">Unable to process</h1>
      <p class="| body-md">
        {{
          (error as any)?.statusMessage ||
          "This link may have expired or already been used."
        }}
      </p>
    </template>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const token = route.params.token as string;
const action = route.query.action as string;

const { data, error } = await useAsyncData("ownership-review", () =>
  $fetch<{ action: string; draftListingId: number; deletionWarning: boolean }>(
    "/api/ownership-verification/review",
    { query: { token, action } },
  ),
);

const isApprove = computed(() => data.value?.action === "approve");
</script>
