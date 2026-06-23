<template>
  <div
    v-if="isUploading"
    class="space-y-2"
  >
    <div class="flex items-center justify-between">
      <span class="body-sm text-muted">
        {{
          uploadProgress < 100 ?
            `Uploading ${uploadingCount} ${itemType}${uploadingCount > 1 ? "s" : ""}...`
          : completedLabel
        }}
      </span>
      <span class="body-sm font-medium">{{ Math.round(uploadProgress) }}%</span>
    </div>
    <UProgress
      :model-value="uploadProgress"
      color="secondary"
      size="md"
      class="w-full"
      :ui="{
        base: 'relative overflow-hidden rounded-full bg-accented h-2',
        indicator:
          'rounded-full size-full bg-secondary transition-transform duration-200 ease-out',
      }"
    />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    isUploading: boolean;
    uploadProgress: number;
    uploadingCount: number;
    itemType: string;
    completedLabel: string;
  }

  defineProps<Props>();
</script>
