<template>
  <UPopover v-model:open="isOpen" :ui="{ content: 'w-72 p-3' }">
    <UButton
      size="sm"
      icon="i-lucide-filter"
      variant="solid"
      class="text-white! body-sm cursor-pointer"
    >
      <span class="hidden sm:inline">Filters</span>
    </UButton>
    <template #content>
      <div class="flex flex-col gap-2">
        <slot />
      </div>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
const isOpen = ref(false);

defineExpose({
  close: () => (isOpen.value = false),
});
</script>
