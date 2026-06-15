<template>
  <div
    v-if="images.length > 0"
    class="space-y-4"
  >
    <div class="flex items-center justify-between">
      <h3 class="body-sm font-semibold">Uploaded Images ({{ images.length }})</h3>
      <UButton
        v-if="images.length > 0"
        label="Remove All"
        color="error"
        variant="subtle"
        size="xs"
        icon="i-lucide-trash-2"
        :loading="isRemovingAll"
        :disabled="disabled || isRemovingAll"
        class="body-sm"
        @click="$emit('remove-all')"
      />
    </div>

    <UAccordion
      :items="accordionItems"
      type="multiple"
      :default-value="defaultOpenSections"
      :ui="{
        item: 'border border-default rounded-lg mb-3 last:border-b!',
        trigger: 'px-4 py-3 items-center',
        label: 'title-xs mb-0!',
        leadingIcon: 'text-secondary',
        content: 'px-0 pt-0 pb-0 border-b-0!',
      }"
    >
      <template #default="{ item }">
        <span class="flex items-center gap-2">
          {{ item.label }}
          <UBadge
            :label="String(item.count)"
            color="secondary"
            variant="subtle"
            size="lg"
          />
        </span>
      </template>
      <template #body="{ item }">
        <div class="p-3 pt-1">
          <!-- Main image info alert for general images -->
          <UAlert
            v-if="item.value === 'general'"
            color="secondary"
            variant="subtle"
            icon="i-lucide-info"
            class="mb-3"
          >
            <template #title>
              <span class="body-sm mb-0!">
                Drag images to reorder (desktop) or use the Position dropdown to change
                order. The first image will be your main listing image.
              </span>
            </template>
          </UAlert>
          <UAlert
            v-else
            color="secondary"
            variant="subtle"
            icon="i-lucide-info"
            class="mb-3"
          >
            <template #title>
              <span class="body-sm mb-0!">
                Drag images (desktop) or use the Position dropdown to set the display
                order for this room.
              </span>
            </template>
          </UAlert>

          <div
            :ref="(el) => $emit('set-sortable-ref', item.value, el as HTMLElement | null)"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sortable-grid"
          >
            <MoleculesDashboardCreateListingStep9ImageCard
              v-for="(image, index) in getImagesForGroup(item.value)"
              :key="image.cloudflareId"
              :image="image"
              :actual-index="images.indexOf(image)"
              :position="index + 1"
              :total-in-group="getImagesForGroup(item.value).length"
              :is-main="item.value === 'general' && index === 0"
              :is-deleting="deletingIds.has(image.cloudflareId)"
              :disabled="disabled"
              :room-options="roomOptions"
              :selected-room="getSelectedRoom(image)"
              @delete="$emit('delete-image', $event)"
              @assign-room="(id, room) => $emit('assign-room', id, room)"
              @change-position="
                (id, pos) => $emit('change-position', item.value, id, pos)
              "
            />
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    images: MediaAssignment[];
    groupedImages: ImageGroup[];
    accordionItems: ImageAccordionItem[];
    roomOptions: RoomOption[];
    deletingIds: Set<string>;
    isRemovingAll?: boolean;
    disabled?: boolean;
  }

  const props = defineProps<Props>();

  defineEmits<{
    "remove-all": [];
    "delete-image": [cloudflareId: string];
    "assign-room": [cloudflareId: string, roomValue: string];
    "set-sortable-ref": [groupKey: string, el: HTMLElement | null];
    "change-position": [groupKey: string, cloudflareId: string, newPosition: number];
  }>();

  const defaultOpenSections = computed(() => {
    const firstItem = props.accordionItems[0];
    return firstItem ? [firstItem.value] : [];
  });

  function getImagesForGroup(groupKey: string): MediaAssignment[] {
    return props.groupedImages.find((g) => g.key === groupKey)?.images ?? [];
  }
</script>

<style scoped>
  .sortable-ghost {
    opacity: 0.4;
    background: var(--color-secondary-100);
  }

  .sortable-chosen {
    box-shadow: 0 0 0 2px var(--color-secondary-500);
  }

  .sortable-drag {
    opacity: 1;
  }
</style>
