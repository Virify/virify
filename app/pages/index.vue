<script setup lang="ts">
import { onMounted, ref, reactive, defineEmits } from "vue";

// Declare the map and other variables
let map: any;
const { searchLocations } = useNominatim();

interface LocationResult {
  displayName: string;
  lat: string;
  lon: string;
}

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

const isFocused = ref(false);
const searchResults = ref<LocationResult[]>([]);

// Declare function to initialize the map
const initMap = async () => {
  if (process.client) {
    const L = (await import("leaflet")).default;
    map = L.map("map").setView([51.505, -0.09], 13); // Default center location

    // Add the tile layer from Thunderforest
    L.tileLayer("https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=af595be16ce74189830298ecbc224556", {
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
};

onMounted(() => {
  initMap(); // Initialize the map when the component is mounted
});

// Function to search for locations
const handleInput = async () => {
  if (state.search.length > 2) {
    const results = (await searchLocations(state.search)) as LocationResult[];

    searchResults.value = results.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } else {
    searchResults.value = [];
  }
};

// Function to select a location from the search results
const selectLocation = (result: LocationResult) => {
  state.search = result.displayName;
  searchResults.value = [];
};

// Function to place a marker on the map with a custom popup template
const placeMarkerOnMap = (lat: string, lon: string, location: string) => {
  const L = (window as any).L;
  const latLng = [parseFloat(lat), parseFloat(lon)];

  // Set the map view to the new location and add a marker
  map.setView(latLng, 13);

  // Create custom popup content
  const popupContent = `
    <div>
      <h3>${location}</h3>
      <p>Coordinates: ${lat}, ${lon}</p>
      <button onclick="alert('Details for ${location}')">View Details</button>
    </div>
  `;

  // Add marker with custom popup
  L.marker(latLng).addTo(map).bindPopup(popupContent).openPopup();
};

// Function to handle form submission (onSubmit)
const onSubmit = async (event: any) => {
  console.log("Form submitted with:", state);

  try {
    // Search for the location based on the user's input and place the marker
    const results = (await searchLocations(state.search)) as LocationResult[];
    if (results.length > 0) {
      const result = results[0];
      if (result) {
        placeMarkerOnMap(result.lat, result.lon, result.displayName);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 100);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full space-y-6 overflow-hidden">
    <UForm @submit="onSubmit" :state="state" class="w-full max-w-3/4 p-4">
      <div class="relative w-full">
        <UInput
          v-model="state.search"
          label="Search for properties"
          placeholder="Enter property name or description"
          type="text"
          aria-label="Property search"
          size="xl"
          class="w-full z-1"
          @input="handleInput"
          @focus="isFocused = true"
          @blur="handleBlur"
        />
        <ul v-if="isFocused && searchResults.length" class="absolute z-10 mt-1 w-full rounded-lg shadow-md max-h-60 overflow-y-auto border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
          <li v-for="(result, index) in searchResults" :key="index" @mousedown.prevent="selectLocation(result)" class="p-3 cursor-pointer text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
            {{ result.displayName }}
          </li>
        </ul>
      </div>

      <UButton type="submit" color="primary" variant="solid" size="xl" class="mt-3 py-3"> Search </UButton>
    </UForm>

    <!-- Map container with enhanced styling -->
    <div id="map" class="map-container mt-6 w-full z-0 h-full">
      <!-- Map will appear here -->
    </div>
  </div>
</template>

<style scoped>
.map-container {
  height: 1019px;
  overflow: hidden;
}

.map-container .leaflet-container {
  background-color: #f7fafc;
}
</style>
