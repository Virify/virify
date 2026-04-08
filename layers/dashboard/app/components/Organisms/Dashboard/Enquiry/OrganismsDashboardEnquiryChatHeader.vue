<template>
  <div class="flex items-center xl:max-w-fit max-w-[90%] gap-3">
    <UAvatar
      :src="otherUser?.avatar || undefined"
      :alt="otherUser?.username!"
      :name="otherUser?.username!"
      size="lg"
      class="bg-(--background-300) shrink-0 self-start"
    />
    <div class="flex flex-col gap-1 min-w-0 flex-1">
      <h2 class="text-sm font-bold leading-none">{{ otherUser?.username || "Unknown User" }}</h2>
      <p class="text-xs text-(--foreground-200)/80 max-w-full py-2 font-normal">{{ subTitle }}</p>
      <USelect
        v-if="isOwner && availabilityItems.length > 0"
        :model-value="availabilityStatus"
        :items="availabilityItems"
        :disabled="isUpdating"
        size="xs"
        color="secondary"
        class="mt-1 w-36"
        :ui="{ value: 'text-sm font-normal' }"
        @update:model-value="$emit('availabilityChange', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  otherUser: { username?: string | null; avatar?: string | null } | null;
  subTitle: string;
  isOwner: boolean;
  availabilityStatus: string;
  availabilityItems: { value: string | number | boolean | null; label: string }[];
  isUpdating: boolean;
}>();

defineEmits<{
  availabilityChange: [value: string | number | boolean | null];
}>();
</script>
