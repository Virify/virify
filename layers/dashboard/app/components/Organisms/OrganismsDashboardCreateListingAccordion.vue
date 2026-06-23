<template>
  <UAccordion
    v-model="modelValue"
    :items="accordionItems"
    color="secondary"
    class="w-full lg:hidden"
    :ui="{
      root: 'bg-(--background-100)!',
      header: 'title-xs!',
      label: 'title-md! font-bold mb-0!',
      leadingIcon: 'text-secondary',
    }"
  >
    <template
      v-for="step in props.steps"
      :key="`${step.value}-label`"
      #[`${step.value}-label`]
    >
      <span>{{ step.title }}</span>
      <span
        v-if="step.completed"
        class="text-sm text-green-600 font-normal ml-2"
        >Completed</span
      >
    </template>
    <template
      v-for="step in props.steps"
      :key="step.id"
      #[step.slot]
    >
      <OrganismsDashboardCreateListingStepForms :step-number="step.id" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
  interface Props {
    steps: readonly CreateListingStep[];
  }

  const props = defineProps<Props>();
  const { canNavigateToStep } = useCreateListingSteps();

  const modelValue = defineModel<string>({ default: "1" });

  const accordionItems = computed(() => {
    const items = props.steps.map((step) => ({
      label: step.title,
      slot: step.slot,
      content: step.content,
      value: step.value,
      disabled: !canNavigateToStep(step.id),
      icon: step.icon,
      step,
    }));
    return items;
  });
</script>
