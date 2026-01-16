<template>
  <div class="lg:p-4">
    <Transition name="step-fade" mode="out-in">
      <component :is="currentStepComponent" :key="stepNumber" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stepNumber: number
}

const props = defineProps<Props>()

const currentStepComponent = computed(() => {
  switch (props.stepNumber) {
    case 1:
      return resolveComponent('OrganismsDashboardCreateListingStep1Form')
    case 2:
      return resolveComponent('OrganismsDashboardCreateListingStep2Form')
    case 3:
      return resolveComponent('OrganismsDashboardCreateListingStep3Form')
    default:
      return 'p'
  }
})
</script>

<style scoped>
.step-fade-enter-active,
.step-fade-leave-active {
  transition: opacity 0.15s ease;
}

.step-fade-enter-from,
.step-fade-leave-to {
  opacity: 0;
}
</style>
