<template>
  <div id="map" class="w-full h-80"></div>
</template>

<script setup>
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

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

  // quick hack for leaflet default marker icon
  L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
  L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  L.Icon.Default.imagePath = ""

  L.marker([props.lat, props.lon]).addTo(map);
});
</script>
