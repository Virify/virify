<template>
  <div class="loading-content">
    <div class="loading-details">
      <span class="loading-query | body-sm">"{{ lastSearchQuery }}"</span>
    </div>
    <div class="loading-spinner">
      <AtomsBarSpinner />
    </div>
    <p class="loading-text body-sm">{{ wittyLoadingMessage }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lastSearchQuery: string;
}>();

const wittyLoadingMessages = [
  "Please wait while the AI does your work",
  "Our premium plan is faster",
  "Enjoy this useless loading animation",
  "Teaching AI the difference between flats and houses.",
  "Convincing the AI not to become sentient (again).",
  "Calibrating your virtual assistant’s caffeine intake ☕",
  "Compiling witty responses… please wait.",
  "Convincing AI to search",
  "Doing something useful..",
  "Installing curb appeal… please wait.",
  "Fluffing virtual pillows for maximum coziness 🛋️",
  "Checking property values... and moral values.",
  "Calculating how much garden you can actually afford 🌻",
  "Staging your dream home with imaginary furniture.",
  "Consulting your neighbour's cat about market trends 🐈",
  "Photoshopping blue skies over every property photo 🌤️",
  "Updating price tags to keep pace with your hopes.",
  "Running a background check… on the neighborhood.",
  "Sweeping under the data rug for last-minute listings.",
  "Convincing the AI that 'garden-facing’ isn’t a personality.",
  "Planting virtual hedges to boost kerb appeal.",
  "Dusting off long-lost floor plans from the archives.",
];

const wittyLoadingMessage = computed(() => {
  const randomIndex = Math.floor(Math.random() * wittyLoadingMessages.length);
  return wittyLoadingMessages[randomIndex] ?? 'Searching for properties...';
});
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.loading-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--size-32);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  color: var(--secondary-400);
}

.loading-text {
  color: var(--text-color);
  font-size: var(--font-size-md);
  min-height: var(--size-32);
}

.loading-details {
  margin: 0;
}

.loading-query {
  display: inline-block;
  padding: var(--size-8) var(--size-16);
  border: 1px solid fn.faded-color(15%);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  font-style: italic;
}
</style>
