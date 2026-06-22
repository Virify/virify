<template>
  <div class="space-y-4">
    <UFormField
      label="Floor Plans"
      name="property.floorPlans"
      description="Upload one or more floor plans (image files only)"
      hint="PNG, JPG, WebP, or GIF • Max 10MB per file"
    >
      <UFileUpload
        v-model="localFiles"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        multiple
        :disabled="isUploading || isProcessing || atMaxFloorPlans"
        :icon="uploadError ? 'i-lucide-alert-circle' : 'i-lucide-layout-template'"
        :label="uploadError || 'Drop floor plans here or click to upload'"
        :description="
          uploadError ? '' : (
            `${floorPlans.length} of ${maxFloorPlans} floor plans uploaded`
          )
        "
        :color="uploadError ? 'error' : 'secondary'"
        :highlight="!!uploadError"
        :interactive="false"
        class="min-h-48 w-90 m-auto pt-6"
        :ui="{
          base:
            uploadError ? 'bg-error/10' : (
              'bg-(--background-100) hover:bg-(--background-200)'
            ),
        }"
        :preview="false"
      >
        <template #actions="{ open }">
          <UButton
            :label="atMaxFloorPlans ? 'Maximum reached' : 'Select Floor Plans'"
            icon="i-lucide-upload"
            color="secondary"
            variant="outline"
            :disabled="isUploading || isProcessing || atMaxFloorPlans"
            @click="
              uploadError = '';
              open();
            "
          />
        </template>
      </UFileUpload>
    </UFormField>

    <div
      v-if="floorPlans.length > 0"
      class="grid gap-3 sm:grid-cols-2"
    >
      <div
        v-for="plan in floorPlans"
        :key="plan.cloudflareId"
        class="flex items-center gap-3 rounded-lg border border-default p-3"
      >
        <img
          :src="getImageUrl(plan.cloudflareId)"
          alt="Floor plan"
          class="h-14 w-14 rounded object-cover"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm text-default">
            {{ plan.filename || `Floor plan ${plan.cloudflareId.slice(0, 8)}` }}
          </p>
        </div>

        <UButton
          color="error"
          variant="ghost"
          class="body-sm"
          size="xs"
          :loading="deletingIds.has(plan.cloudflareId)"
          :disabled="isUploading || isProcessing"
          @click="emit('remove-floor-plan', plan.cloudflareId)"
        >
          Remove
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    floorPlans: FloorPlanAssignment[];
    deletingIds: Set<string>;
    isUploading: boolean;
    isProcessing: boolean;
    maxFloorPlans: number;
    getImageUrl: (id: string, variant?: string) => string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "files-selected": [files: File[]];
    "remove-floor-plan": [cloudflareId: string];
  }>();

  const localFiles = ref<File[]>([]);
  const uploadError = ref("");

  const atMaxFloorPlans = computed(
    () => props.maxFloorPlans > 0 && props.floorPlans.length >= props.maxFloorPlans,
  );

  watch(localFiles, (files) => {
    if (!files || files.length === 0) return;

    uploadError.value = "";

    const remainingSlots = props.maxFloorPlans - props.floorPlans.length;
    if (files.length > remainingSlots) {
      uploadError.value = `Upload limit exceeded (max ${props.maxFloorPlans} floor plans)`;
      nextTick(() => {
        localFiles.value = [];
      });
      return;
    }

    emit("files-selected", [...files]);
    nextTick(() => {
      localFiles.value = [];
    });
  });
</script>
