<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" @error="onFormError" :validateOn="['input']" class="flex flex-col h-full">
    <!-- Scrollable Form Content -->
    <div class="flex-1 space-y-8 py-4 px-0 lg:px-6 lg:overflow-y-auto">
      <!-- Dismissible Alert Slot -->
      <slot name="alert" />

      <!-- Form Fields Slot -->
      <slot />
    </div>

    <!-- Sticky Footer Actions -->
    <div class="sticky bottom-0 bg-(--background-200) dark:bg-(--background-100) border-t border-black/20 py-4 px-6 lg:px-4 mt-auto">
      <div class="flex justify-between flex-wrap items-center gap-4">
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
            {{ stepNumber === 9 ? 'Complete' : 'Next Step' }}
          </UButton>
        </div>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { ZodSchema } from 'zod'

interface Props {
  stepNumber: number
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
const toast = useToast()

// Cancel handler
function onCancel() {
  closeModal?.()
}

// Form validation error handler
function onFormError(error: any) {
  console.error('Form validation failed:', error)
  toast.add({
    title: 'Validation Error',
    description: error?.errors?.[0]?.message || 'Please check the form fields',
    color: 'error'
  })
}

// Submit handler (next step)
async function onSubmit() {
  console.log('onSubmit called')
  await handleSave(true)
}

// Save progress without advancing
async function handleSaveProgress() {
  await handleSave(false)
}

// Delegate to composable's saveStep
async function handleSave(advance: boolean) {
  if (!props.isValid || isSaving.value) return
  
  const result = await saveStep(
    props.stepNumber,
    props.apiEndpoint,
    props.getSubmissionData(),
    advance
  )
  
  // Handle different result types
  const success = result === true || (typeof result === 'object' && result?.success)
  const draftComplete = typeof result === 'object' && result?.draftComplete
  
  if (success) {
    if (draftComplete) {
      // Step 9 complete - close the modal
      closeModal?.()
    } else if (advance) {
      emit('completed')
    } else {
      emit('saved')
    }
  }
}
</script>
