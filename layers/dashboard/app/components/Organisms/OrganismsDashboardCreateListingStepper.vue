<template>
  <div class="w-full hidden lg:block">
    <UStepper
      :items="stepperItems"
      :model-value="modelValue"
      @update:model-value="(val) => $emit('update:modelValue', typeof val === 'number' ? val.toString() : val)"
      color="secondary"
      orientation="horizontal"
      class="w-full"
      size="md"
      :ui="{
        separator: 'bg-secondary!',
        title: 'text-sm! sm:text-sm!',
        description: 'hidden!',
        content: 'hidden!',
        indicator: 'border rounded-full bg-elevated group-data-[state=active]:bg-secondary group-data-[state=active]:text-white group-data-[state=completed]:bg-primary group-data-[state=completed]:text-white',
      }"
    />
    <!-- Render forms outside stepper to control transitions -->
    <OrganismsDashboardCreateListingStepForms :step-number="currentStepNumber" />
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

// Map steps to stepper items with disabled state
const stepperItems = computed(() => {
  const items = props.steps.map(step => ({
    title: step.title,
    value: step.value,
    disabled: step.locked,
    // Per-item UI overrides for locked steps
    ui: step.locked ? {
      separator: 'bg-(--secondary-400)/50!',
      title: 'text-muted/50!',
      trigger: 'cursor-not-allowed! opacity-50!'
    } : {}
  }))
  return items
})
</script>
