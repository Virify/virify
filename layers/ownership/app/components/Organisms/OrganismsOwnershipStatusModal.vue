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
        <UAlert
          v-if="isPending"
          icon="i-lucide-clock"
          color="warning"
          variant="soft"
          title="Review in progress"
          description="Your ownership documents have been submitted and are being reviewed by our team. You can still work on your draft listings and publish once approved."
        />

        <UAlert
          v-if="isDenied"
          icon="i-lucide-x-circle"
          color="error"
          variant="soft"
          title="Verification not approved"
          description="Unfortunately your ownership documents were not approved. You can re-submit new documents for review."
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-2 w-full">
        <UButton color="neutral" variant="ghost" @click="close">Close</UButton>
        <div class="flex gap-2">
          <UButton color="neutral" variant="outline" @click="goToDrafts"
            >View my drafts</UButton
          >
          <UButton v-if="isDenied" color="primary" @click="reSubmit"
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
const { isPending, isDenied } = useOwnershipVerification(
  computed(() => props.draftListingId),
);

const emit = defineEmits<{
  resubmit: [];
}>();

const statusIcon = computed(() =>
  isPending.value ? "i-lucide-clock" : "i-lucide-x-circle",
);
const statusIconColor = computed(() =>
  isPending.value ? "text-amber-500" : "text-red-500",
);

function open() {
  isOpen.value = true;
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
