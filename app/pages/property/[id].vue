<template>
  <div class="p-6 max-w-4xl mx-auto">

    <div v-if="property">
      <table class="table-auto w-full text-left border-collapse border border-gray-200">
        <tbody>
          <!-- Basic Info -->
          <tr class="bg-gray-100">
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Basic Info</th>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Title</td>
            <td class="px-4 py-2">{{ property.title }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Description</td>
            <td class="px-4 py-2">{{ property.description }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Type</td>
            <td class="px-4 py-2">{{ property.type.name }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Classification</td>
            <td class="px-4 py-2">{{ property.classification.name }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Price</td>
            <td class="px-4 py-2">£{{ property.value?.toLocaleString() }}</td>
          </tr>

          <!-- Parking Info -->
          <tr class="bg-gray-100">
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Parking</th>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Description</td>
            <td class="px-4 py-2">{{ property.parking?.description || 'N/A' }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Driveway</td>
            <td class="px-4 py-2">{{ property.parking?.driveway ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">EV Charging</td>
            <td class="px-4 py-2">{{ property.parking?.evCharging ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Garage</td>
            <td class="px-4 py-2">{{ property.parking?.garage ? 'Yes' : 'No' }}</td>
          </tr>

          <!-- Bedroom & Bathroom Info -->
          <tr class="bg-gray-100">
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Features</th>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Bedrooms</td>
            <td class="px-4 py-2">{{ property.bedroomFeatures.length }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Bathrooms</td>
            <td class="px-4 py-2">{{ property.bathroomFeatures.length }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-500">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { PropertyWithRelations } from "~/types/property";

const route = useRoute();
const id = route.params.id;
const propertyId = route.params.id as string;

const url: string = `/api/property/${propertyId}`;

const { data: property } = await useAsyncData("property", () =>
  $fetch<PropertyWithRelations>(url)
);
</script>
