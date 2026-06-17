<template>
  <div
    v-if="totalImages > 0"
    class="space-y-4"
  >
    <div class="flex items-center justify-between">
      <h3 class="body-sm font-semibold">Uploaded Images ({{ totalImages }})</h3>
      <UButton
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
          <UAlert
            v-if="item.value === 'general'"
            color="secondary"
            variant="subtle"
            icon="i-lucide-info"
            class="mb-3"
          >
            <template #title>
              <span class="body-sm mb-0!">
                Drag images to reorder. The first image will be your main listing image.
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
                Drag images to set the display order for this room.
              </span>
            </template>
          </UAlert>

          <VueDraggable
            v-model="localGroupImages[item.value] as MediaAssignment[]"
            :animation="200"
            ghost-class="drag-ghost"
            chosen-class="drag-chosen"
            :disabled="disabled"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            @update="onGroupReorder(item.value)"
          >
            <MoleculesDashboardCreateListingStep9ImageCard
              v-for="(image, index) in localGroupImages[item.value] ?? []"
              :key="image.cloudflareId"
              :image="image"
              :position="index + 1"
              :total-in-group="(localGroupImages[item.value] ?? []).length"
              :is-main="item.value === 'general' && index === 0"
              :is-deleting="deletingIds.has(image.cloudflareId)"
              :disabled="disabled"
              :room-options="roomOptions"
              :selected-room="getSelectedRoom(image)"
              @delete="$emit('delete-image', $event)"
              @update-title="(id, title) => $emit('update-title', id, title)"
              @assign-room="(id, room) => $emit('assign-room', id, room)"
              @change-position="
                (id: string, pos: number) => $emit('change-position', item.value, id, pos)
              "
            />
          </VueDraggable>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
  import { VueDraggable } from "vue-draggable-plus";

  interface Props {
    groups: ImageGroup[];
    accordionItems: ImageAccordionItem[];
    roomOptions: RoomOption[];
    deletingIds: Set<string>;
    isRemovingAll?: boolean;
    disabled?: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "remove-all": [];
    "delete-image": [cloudflareId: string];
    "update-title": [cloudflareId: string, title: string];
    "assign-room": [cloudflareId: string, roomValue: string];
    "reorder-group": [groupKey: string, newImages: MediaAssignment[]];
    "change-position": [groupKey: string, cloudflareId: string, newPosition: number];
  }>();

  // Per-group local arrays that VueDraggable v-model mutates on drag.
  // Synced from props; after a reorder the parent updates groups and the
  // watchEffect re-syncs with the same (correct) order — a no-op visually.
  const localGroupImages = ref<Record<string, MediaAssignment[]>>({});

  watchEffect(() => {
    const next: Record<string, MediaAssignment[]> = {};
    for (const group of props.groups) {
      next[group.key] = [...group.images];
    }
    localGroupImages.value = next;
  });

  const totalImages = computed(() =>
    props.groups.reduce((sum, g) => sum + g.images.length, 0),
  );

  const defaultOpenSections = computed(() => {
    const firstItem = props.accordionItems[0];
    return firstItem ? [firstItem.value] : [];
  });

  function onGroupReorder(groupKey: string) {
    const newImages = localGroupImages.value[groupKey];
    if (newImages) {
      emit("reorder-group", groupKey, [...newImages]);
    }
  }
</script>

<style scoped>
  .drag-ghost {
    opacity: 0.4;
    background: var(--color-secondary-100);
    border-radius: 0.5rem;
  }

  .drag-chosen {
    box-shadow: 0 0 0 2px var(--color-secondary-500);
    border-radius: 0.5rem;
  }
</style>
