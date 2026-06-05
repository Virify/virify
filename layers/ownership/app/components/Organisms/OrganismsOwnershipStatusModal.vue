<template>
  <UModal v-model:open="isOpen" class="max-w-md">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon :name="statusIcon" :class="['w-5 h-5', statusIconColor]" />
        <span class="font-semibold text-base">Ownership Verification</span>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div v-if="loading" class="flex justify-center py-4">
          <UIcon
            name="i-lucide-loader"
            class="w-5 h-5 animate-spin text-muted"
          />
        </div>

        <template v-else>
          <UAlert
            v-if="isApproved"
            icon="i-lucide-shield-check"
            color="success"
            variant="soft"
            title="Ownership verified"
            description="Your ownership has been confirmed by our team. You are now able to publish this listing."
          />

          <UAlert
            v-else-if="isPending"
            icon="i-lucide-clock"
            color="warning"
            variant="soft"
            title="Review in progress"
            description="Your ownership documents have been submitted and are being reviewed by our team. You can still work on your draft listings and publish once approved."
          />

          <UAlert
            v-else-if="isDenied"
            icon="i-lucide-x-circle"
            color="error"
            variant="soft"
            title="Verification not approved"
            description="Unfortunately your ownership documents were not approved. You can re-submit new documents for review."
          />
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          class="body-sm"
          size="xs"
          @click="close"
          >Close</UButton
        >
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="goToDrafts"
            size="xs"
            class="body-sm"
            >View my drafts</UButton
          >
          <UButton
            v-if="isDenied"
            color="neutral"
            variant="outline"
            @click="reSubmit"
            size="xs"
            class="body-sm"
            >Re-submit documents</UButton
          >
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ draftListingId: number }>();
const isOpen = ref(false);
const { isPending, isDenied, isApproved, loading, refresh } =
  useOwnershipVerification(computed(() => props.draftListingId));

const emit = defineEmits<{
  resubmit: [];
}>();

const statusIcon = computed(() => {
  if (isApproved.value) return "i-lucide-shield-check";
  if (isPending.value) return "i-lucide-clock";
  return "i-lucide-x-circle";
});
const statusIconColor = computed(() => {
  if (isApproved.value) return "text-green-600";
  if (isPending.value) return "text-amber-500";
  return "text-red-500";
});

async function open() {
  isOpen.value = true;
  await refresh();
}

function close() {
  isOpen.value = false;
}

function goToDrafts() {
  close();
  navigateTo("/dashboard/draft-listings");
}

function reSubmit() {
  close();
  emit("resubmit");
}

defineExpose({ open, close });
</script>
