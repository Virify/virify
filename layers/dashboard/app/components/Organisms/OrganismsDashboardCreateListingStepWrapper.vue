<template>
  <UForm ref="formRef" :schema="schema" :state="state" @submit="onSubmit" @error="onFormError" :validateOn="['input']"
    class="flex flex-col h-full">
    <!-- Scrollable Form Content -->
    <div class="flex-1 space-y-8 py-4 px-0 lg:px-6 lg:overflow-y-auto">
      <!-- Dismissible Alert Slot -->
      <slot name="alert" />

      <!-- Form Fields Slot -->
      <slot />
    </div>

    <!-- Sticky Footer Actions -->
    <div
      class="sticky bottom-0 bg-(--background-100) dark:bg-(--background-200) border-t border-black/20 py-4 px-6 lg:px-4 mt-auto">
      <div class="flex justify-between flex-wrap items-center gap-4">
        <UButton type="button" variant="subtle" color="neutral" size="sm" @click="onCancel"
          class="body-sm cursor-pointer">
          Cancel
        </UButton>

        <div class="flex gap-2">
          <UButton type="button" variant="solid" color="secondary" size="sm" @click="handleSaveProgress"
            :disabled="!isValid || isSaving || isModerating" :loading="isSaving || isModerating" class="body-sm text-white! cursor-pointer">
            Save Progress
          </UButton>

          <UButton v-if="stepNumber > 1" type="button" variant="solid" color="secondary" size="sm" @click="previousStep"
            icon="i-lucide-arrow-left" class="body-sm cursor-pointer text-white!">
            Back
          </UButton>

          <UButton type="submit" color="secondary" variant="solid" size="sm" :disabled="!isValid || isSaving || isModerating"
            :loading="isSaving || isModerating" trailing-icon="i-lucide-arrow-right" class="body-sm text-white! cursor-pointer">
            {{ stepNumber === 9 ? 'Complete' : 'Next Step' }}
          </UButton>
        </div>
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { ZodSchema } from 'zod'
import type { FormError } from '#ui/types'
import type { ModerationField } from '~~/app/composables/useModerateFields'

interface Props {
  stepNumber: number
  schema: ZodSchema
  state: Record<string, any>
  isValid: boolean
  apiEndpoint: string
  getSubmissionData: () => Record<string, any>
  /** Explicit list of user-entered text fields to run through moderation before saving. */
  getFieldsToModerate?: () => ModerationField[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  saved: []
  completed: []
}>()

const { saveStep, isSaving, previousStep } = useCreateListingSteps()
const closeModal = inject<() => void>('closeModal')
const toast = useToast()
const { moderateFields, isModerating } = useModerateFields()

// Ref to the UForm so we can call setErrors() for moderation failures
const formRef = ref<{ setErrors: (errors: FormError[]) => void } | null>(null)

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
    color: 'error',
    icon: 'i-lucide-circle-x',
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

  // Run moderation on any text fields the step has declared
  if (props.getFieldsToModerate) {
    const passed = await moderateFields(props.getFieldsToModerate(), formRef)
    if (!passed) return
  }

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
