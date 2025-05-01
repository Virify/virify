<template>
  <div id="map" class="w-full h-80"></div>
</template>

<script setup>
import L from "leaflet";

const props = defineProps({
  lat: {
    type: Number,
  },
  lon: {
    type: Number,
  },
});

onMounted(() => {
  const map = L.map("map", {
    center: [props.lat, props.lon],
    zoom: 15,
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([props.lat, props.lon]).addTo(map);
});
</script>
