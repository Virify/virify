<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-8 pt-2">
    <!-- Dismissible Alert -->
    <UAlert
      v-if="!alertDismissed"
      icon="i-lucide-info"
      variant="subtle"
      color="secondary"
      :title="alertTitle"
      :description="alertDescription"
      close
      @update:open="(val) => alertDismissed = !val"
    />

    <!-- Form Fields Slot -->
    <slot />

    <!-- Form Actions -->
    <div class="flex justify-between flex-wrap items-center gap-4 pt-2 pb-6 lg:pb-0">
      <UButton 
        type="button" 
        variant="subtle"
        color="neutral"
        size="sm"
        @click="onCancel"
        class="body-sm cursor-pointer"
      >
        Cancel
      </UButton>

      <div class="flex gap-4">
        <UButton 
          type="button" 
          variant="solid"
          color="secondary"
          size="sm"
          @click="handleSaveProgress"
          :disabled="!isValid || isSaving"
          :loading="isSaving"
          class="body-sm text-white! cursor-pointer"
        >
          Save Progress
        </UButton>
      
        <UButton 
          type="submit" 
          color="secondary"
          variant="solid"
          size="sm"
          :disabled="!isValid || isSaving"
          :loading="isSaving"
          class="body-sm text-white! cursor-pointer"
        >
          Next Step
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { ZodSchema } from 'zod'

interface Props {
  stepNumber: number
  alertTitle: string
  alertDescription: string
  schema: ZodSchema
  state: Record<string, any>
  isValid: boolean
  apiEndpoint: string
  getSubmissionData: () => Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
  completed: []
}>()

const { saveStep, isSaving } = useCreateListingSteps()
const closeModal = inject<() => void>('closeModal')

// Alert state
const alertDismissed = ref(false)

// Cancel handler
function onCancel() {
  closeModal?.()
}

// Submit handler (next step)
async function onSubmit() {
  await handleSave(true)
}

// Save progress without advancing
async function handleSaveProgress() {
  await handleSave(false)
}

// Delegate to composable's saveStep
async function handleSave(advance: boolean) {
  if (!props.isValid || isSaving.value) return
  
  const success = await saveStep(
    props.stepNumber,
    props.apiEndpoint,
    props.getSubmissionData(),
    advance
  )
  
  if (success) {
    if (advance) {
      emit('completed')
    } else {
      emit('saved')
    }
  }
}
</script>
