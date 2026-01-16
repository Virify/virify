<template>
  <div v-if="stepNumber === 1" class="lg:p-4">
    <OrganismsDashboardCreateListingStep1Form />
  </div>
  <div v-else-if="stepNumber === 2" class="p-4">
    <p class="text-sm text-muted-foreground">Step 2 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 3" class="p-4">
    <p class="text-sm text-muted-foreground">Step 3 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 4" class="p-4">
    <p class="text-sm text-muted-foreground">Step 4 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 5" class="p-4">
    <p class="text-sm text-muted-foreground">Step 5 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 6" class="p-4">
    <p class="text-sm text-muted-foreground">Step 6 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 7" class="p-4">
    <p class="text-sm text-muted-foreground">Step 7 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 8" class="p-4">
    <p class="text-sm text-muted-foreground">Step 8 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 9" class="p-4">
    <p class="text-sm text-muted-foreground">Step 9 Form - Add your form component here</p>
  </div>
  <div v-else-if="stepNumber === 10" class="p-4">
    <p class="text-sm text-muted-foreground">Step 10 Form - Add your form component here</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stepNumber: number
}

defineProps<Props>()
</script>
