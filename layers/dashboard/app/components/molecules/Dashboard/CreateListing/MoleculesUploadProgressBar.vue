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
      :value="uploadProgress"
      color="secondary"
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
