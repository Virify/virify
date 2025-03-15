<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

const items = ref([
  { label: "1/2 mile", value: 0.5 },
  { label: "1 mile", value: 1 },
  { label: "2 miles", value: 2 },
  { label: "5 miles", value: 5 },
  { label: "10 miles", value: 10 },
  { label: "20 miles", value: 20 },
  { label: "50 miles", value: 50 },
]);

const state = reactive({
  search: "",
  distance: items.value[0]?.value,
});

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log("Form submitted with:", state);
  try {
    const location = await $fetch('http://localhost:8080/search', {
    method: 'GET',
    query: {
      q: state.search,
      addressdetails: 1,
      format: 'geojson',
    },
  });
  console.log("Location data:", location);
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
  
}
</script>

<template>
  <div class="flex flex-row items-center justify-center w-full h-full p-4">
    <UForm @submit="onSubmit" :state="state" class="w-full max-w-3/4">
      <UInput v-model="state.search" label="Search for properties" placeholder="Enter property name or description" type="text" aria-label="Property search" size="xl" class="w-3/4" />
      <USelect v-model="state.distance" :items="items" size="xl" class="w-1/4" />
      <UButton type="submit" color="primary" variant="solid" size="xl" class="mt-3"> Search </UButton>
    </UForm>
  </div>
</template>
