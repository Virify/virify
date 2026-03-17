<template>
  <div class="w-full hidden lg:flex lg:flex-col lg:h-full lg:min-h-0">
    <!-- Sticky Stepper Header -->
    <div class="sticky top-0 z-10 bg-(--background-100) dark:bg-(--background-200) py-4 border-b border-black/20">
      <div class="px-4 flex items-center justify-center">
        <UStepper :items="stepperItems" :model-value="modelValue"
          @update:model-value="(val) => $emit('update:modelValue', typeof val === 'number' ? val.toString() : val)"
          color="secondary" orientation="horizontal" class="w-full" size="md" :linear="false" :ui="{
            root: 'items-center',
            separator: 'bg-secondary!',
            title: 'text-sm! sm:text-sm!',
            description: 'hidden!',
            content: 'hidden!',
            indicator: 'border rounded-full bg-elevated group-data-[state=active]:bg-secondary group-data-[state=active]:text-white group-data-[state=completed]:bg-primary group-data-[state=completed]:text-white',
          }" />
      </div>
    </div>
    <!-- Scrollable Form Content -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <OrganismsDashboardCreateListingStepForms :step-number="currentStepNumber" />
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  steps: readonly CreateListingStep[]
  modelValue?: string
}

const props = defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

// Get current step number from modelValue
const currentStepNumber = computed(() => {
  if (props.modelValue) {
    return parseInt(props.modelValue, 10)
  }
  return 1
})

// Map steps to stepper items with disabled and completed state styling
const stepperItems = computed(() => {
  const currentValue = currentStepNumber.value

  const items = props.steps.map(step => {
    // Determine step state for styling
    const isLocked = step.locked
    const isCompleted = step.completed
    const isActive = step.id === currentValue

    // Build UI overrides based on state
    // Priority: Locked > Active > Completed > Unlocked (pending)
    let ui: Record<string, string> = {}

    if (isLocked) {
      // Locked steps - greyed out, not clickable (no separator override - use default)
      ui = {
        indicator: 'bg-muted/30! text-muted/50! border-muted/30!',
        title: 'text-muted/50!',
        trigger: 'cursor-not-allowed! opacity-50!'
      }
    } else if (isActive) {
      // Active step - secondary (orange) color with ring highlight
      ui = {
        indicator: 'bg-secondary! text-white! ring-2 ring-secondary ring-offset-2!',
        separator: 'bg-secondary!'
      }
    } else if (isCompleted) {
      // Completed but not active - success (green) color with checkmark
      ui = {
        indicator: 'bg-primary! text-white!',
        separator: 'bg-primary!'
      }
    } else {
      // Unlocked but not completed (pending) - neutral styling (no separator override - use default)
      ui = {
        indicator: 'bg-elevated! text-muted! border border-muted/50!'
      }
    }

    return {
      title: step.title,
      value: step.value,
      disabled: isLocked,
      // Show checkmark for completed steps that aren't active, show number for active
      icon: (isCompleted && !isActive) ? 'i-lucide-check' : undefined,
      ui
    }
  })
  return items
})
</script>
