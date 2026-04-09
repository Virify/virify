<template>
  <div class="space-y-4">
    <!-- File Upload -->
    <UFormField label="Property Images" name="property.media" description="Drag and drop images or click to browse"
      hint="At least one image is required" eager-validation required>
      <UFileUpload v-model="localFiles" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" multiple
        :disabled="isUploading || atMaxImages" :icon="uploadError ? 'i-lucide-alert-circle' : 'i-lucide-image'"
        :label="uploadError || uploadLabel"
        :description="uploadError ? '' : `${currentCount} of ${maxImages} images uploaded`"
        :color="uploadError ? 'error' : 'secondary'" :highlight="!!uploadError" :interactive="false"
        class="min-h-48 w-90 m-auto pt-6" :ui="{
          base: uploadError
            ? 'bg-error/10'
            : 'bg-(--background-100) hover:bg-(--background-200)'
        }" :preview="false">
        <template #actions="{ open }">
          <UButton v-if="!uploadError" :label="atMaxImages ? 'Maximum reached' : 'Select Images'" icon="i-lucide-upload"
            color="secondary" variant="outline" :disabled="isUploading || atMaxImages" @click="open()" />
          <UButton v-else label="Try Again" icon="i-lucide-refresh-cw" color="error" variant="outline"
            @click="uploadError = ''; open()" />
        </template>
      </UFileUpload>
    </UFormField>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="body-sm text-muted">{{ uploadProgress < 100 ? `Uploading ${uploadingCount} image${uploadingCount > 1 ? 's' : ''}...` : uploadLabel }}</span>
        <span class="body-sm font-medium">{{ Math.round(uploadProgress) }}%</span>
      </div>
      <UProgress :value="uploadProgress" color="secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentCount: number
  maxImages: number
  isUploading: boolean
  atMaxImages: boolean
  uploadLabel: string
  uploadProgress: number
  uploadingCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()

// Local v-model for file upload component
const localFiles = ref<File[]>([])
const uploadError = ref('')

// Watch for changes, validate, and emit
watch(localFiles, (files) => {
  if (files && files.length > 0) {
    // Clear previous error
    uploadError.value = ''

    // Check if selecting too many files
    const remainingSlots = props.maxImages - props.currentCount

    if (files.length > remainingSlots) {
      uploadError.value = `Upload limit exceeded (max ${props.maxImages} images)`
      // Reset files without emitting
      nextTick(() => {
        localFiles.value = []
      })
      return
    }

    emit('files-selected', [...files])
    // Reset after a tick so we can select same files again
    nextTick(() => {
      localFiles.value = []
    })
  }
})
</script>
