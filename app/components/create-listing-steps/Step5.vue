<template>
  <section class="step">
    <h2 class="title-sm">Bedrooms and Bathrooms</h2>
    <p class="body-xs">
      <span class="step__required | body-md font-semibold">*</span>
      <em>represents a required field</em>
    </p>
  </section>
</template>
<script setup lang="ts">
const props = defineProps<{
    draft: DraftListingWithFullPayload;
}>();

const stepFiveData = ref<StepFive>(createInitialStepFiveValues(props.draft));
const initialStepData = ref<StepFive>(JSON.parse(JSON.stringify(stepFiveData.value)));
</script>