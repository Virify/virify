<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-medium title-xs mb-0!">
        Kitchens
        <span class="body-xs text-(--foreground-200)/60 font-normal">optional</span>
      </h3>
      <UButton
        variant="subtle"
        size="xs"
        icon="i-lucide-plus"
        class="body-sm"
        color="secondary"
        @click="emit('add')"
      >
        Add Kitchen
      </UButton>
    </div>

    <!-- Empty state -->
    <div v-if="kitchens.length === 0" class="rounded-lg border border-dashed border-elevated p-6 text-center">
      <UIcon name="i-lucide-chef-hat" class="mx-auto h-10 w-10 text-secondary/80" />
      <p class="mt-2 text-sm text-muted italic">No kitchens added yet</p>
    </div>

    <!-- Kitchen cards (compact list) -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(kitchen, index) in kitchens"
        :key="index"
        variant="subtle"
        :ui="{ 
          root: 'border border-secondary/30 ring-0!',
          body: 'p-0'
        }"
        class="border-secondary!"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-start gap-3 min-w-0">
              <UIcon name="i-lucide-chef-hat" class="h-5 w-5 text-muted shrink-0 mt-1" />
              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-1">
                  <span class="font-medium body-sm line-clamp-1">
                    {{ kitchen.name || `Kitchen ${index + 1}` }}
                  </span>
                  <UBadge v-if="isKitchenComplete(kitchen)" color="secondary" variant="subtle" size="md" class="shrink-0">
                    Complete
                  </UBadge>
                </div>
                <p class="text-xs text-muted line-clamp-1 mt-2!">
                  <span v-if="kitchen.features?.length">{{ kitchen.features.length }} feature{{ kitchen.features.length > 1 ? 's' : '' }}</span>
                  <span v-if="kitchen.size">
                    <span v-if="kitchen.features?.length"> · </span>
                    {{ kitchen.size }}m²
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-1">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-pencil"
                @click="emit('edit', index)"
              />
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-trash-2"
                @click="emit('remove', index)"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  kitchens: KitchenData[]
}>()

const emit = defineEmits<{
  add: []
  edit: [index: number]
  remove: [index: number]
}>()

function isKitchenComplete(kitchen: KitchenData): boolean {
  return Boolean(kitchen.name && kitchen.floor !== null && kitchen.floor !== undefined)
}
</script>
