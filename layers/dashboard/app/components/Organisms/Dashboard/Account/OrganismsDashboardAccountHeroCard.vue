<template>
  <UPageCard orientation="horizontal" :title="title" class="pb-4"
    :description="description"
    variant="ghost" :ui="{
      root: 'w-full border-0!',
      container: 'p-2! grid grid-cols-1 lg:grid-cols-4 gap-4 w-full',
      wrapper: 'lg:col-span-3',
      description: 'body-sm text-(--foreground-200)',
      title: 'title-sm',
    }">
    <div class="lg:col-span-1 flex justify-start lg:justify-end h-full lg:items-end w-full">
      <UButton variant="solid" :disabled="disable" color="secondary" :label="label" size="md" :ui="{
        base: 'disabled:cursor-not-allowed!',
        label: 'text-(--monochrome-900) body-sm',
      }" type="submit" />
    </div>
  </UPageCard>
</template>
<script setup lang="ts">
  defineProps<{
    title: string,
    description: string,
    label: string,
    disable?: boolean,
  }>();
</script>