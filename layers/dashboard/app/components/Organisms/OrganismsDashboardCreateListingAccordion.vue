<template>
  <UAccordion
    v-model="modelValue"
    :items="accordionItems"
    color="secondary"
    class="w-full lg:hidden"
    :ui="{
      root: 'bg-(--background-200)!',
      label: 'title-sm font-bold mb-0!'
    }"
  >
    <template v-for="step in props.steps" :key="step.id" #[step.slot]>
      <OrganismsDashboardCreateListingStepForms :step-number="step.id" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">

interface Props {
  steps: readonly CreateListingStep[]
}

const props = defineProps<Props>()

const modelValue = defineModel<string>({ default: '1' })

const accordionItems = computed(() => {
  const items = props.steps.map(step => ({
    label: step.title,
    slot: step.slot,
    content: step.content,
    value: step.value,
    disabled: step.locked
  }))
  return items
})
</script>
