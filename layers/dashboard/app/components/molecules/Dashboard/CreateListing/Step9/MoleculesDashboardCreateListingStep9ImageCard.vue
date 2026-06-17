<template>
  <div
    class="relative border rounded-lg overflow-hidden bg-elevated cursor-grab active:cursor-grabbing"
    :class="[
      isMain ? 'border-secondary ring-2 ring-secondary/30' : 'border-default',
      'transition-all duration-200',
      disabled ? 'cursor-default' : '',
    ]"
    :data-id="image.cloudflareId"
  >
    <!-- Main Image Badge -->
    <div
      v-if="isMain"
      class="absolute top-0 left-0 z-10 bg-secondary text-white text-xs font-medium px-2 py-0.5 rounded-br-lg"
    >
      Main
    </div>

    <!-- Image Preview -->
    <div class="relative aspect-5/4">
      <AtomsCloudFlareImage
        :src="image.cloudflareId"
        :alt="localTitle || 'Property image'"
        variant="marker"
        :modifiers="{ fit: 'cover' }"
        class="w-full h-full object-cover"
      />

      <!-- Delete Button -->
      <UButton
        icon="i-lucide-x"
        variant="solid"
        size="sm"
        class="absolute top-1 right-1 text-white!"
        :loading="isDeleting"
        :disabled="disabled || isDeleting"
        :ui="{ base: 'bg-secondary/100' }"
        @click="$emit('delete', image.cloudflareId)"
      />
    </div>

    <!-- Image Details -->
    <div class="p-2 space-y-2 pb-6">
      <!-- Image Title -->
      <UFormField
        label="Image title"
        :name="`media.${image.cloudflareId}.description`"
        required
        eagerValidation
      >
        <UInput
          :model-value="localTitle"
          placeholder="Enter a title for this image"
          color="secondary"
          size="xs"
          class="w-full"
          maxlength="100"
          @update:model-value="onTitleInput"
        />
      </UFormField>

      <!-- Room Assignment -->
      <UFormField
        label="Assign to Room"
        :name="`media.${image.cloudflareId}.room`"
        hint="optional"
      >
        <USelect
          :model-value="selectedRoom"
          :items="roomOptions"
          placeholder="Select room..."
          color="secondary"
          size="xs"
          class="w-full"
          @update:model-value="$emit('assign-room', image.cloudflareId, String($event))"
        />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    image: MediaAssignment;
    position: number;
    totalInGroup: number;
    isMain?: boolean;
    isDeleting?: boolean;
    disabled?: boolean;
    roomOptions: RoomOption[];
    selectedRoom: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    delete: [cloudflareId: string];
    "update-title": [cloudflareId: string, title: string];
    "assign-room": [cloudflareId: string, roomValue: string];
  }>();

  // Local title ref — persists across parent re-renders and drag reorders.
  // Only syncs from props when the image itself changes (different cloudflareId)
  // or when the parent pushes a fresh description from the server after save.
  const localTitle = ref(props.image.description ?? "");

  // When a completely different image slot arrives (shouldn't happen with :key but be safe)
  watch(
    () => props.image.cloudflareId,
    () => {
      localTitle.value = props.image.description ?? "";
    },
  );

  // Sync server-side updates (e.g. after reload) without clobbering user typing.
  // Only update if the incoming value actually differs from what we're showing.
  watch(
    () => props.image.description,
    (incoming) => {
      const val = incoming ?? "";
      if (val !== localTitle.value) {
        localTitle.value = val;
      }
    },
  );

  function onTitleInput(val: string | number) {
    const str = String(val).slice(0, 100);
    localTitle.value = str;
    emit("update-title", props.image.cloudflareId, str);
  }
</script>
