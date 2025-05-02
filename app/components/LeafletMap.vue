<template>
  <div id="map" class="w-full h-80"></div>
</template>

<script setup lang="ts">
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// Props with marker data including info for popups
const props = defineProps<{
  markers?: {
    id: string | number | null;
    lat: number;
    lon: number;
    title: string | null;
    bedrooms: number | null;
    price: number | null;
  }[];
  lat?: number;
  lon?: number;
  zoom: number;
}>();

onMounted(() => {
  // Determine the default center (if markers exist, use them; otherwise, use lat/lon from props)
  const defaultCenter: [number, number] = props.markers && props.markers.length
    ? [props.markers[0]?.lat ?? 51.505, props.markers[0]?.lon ?? -0.09]
    : [props.lat ?? 51.505, props.lon ?? -0.09];

  const map = L.map("map", {
    center: defaultCenter,
    zoom: props.zoom ?? 18,
    attributionControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Leaflet marker default icon
  L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
  L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
  L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
  L.Icon.Default.imagePath = "";

  // Add markers with popups if `markers` are provided
  if (props.markers && props.markers.length > 0) {
    props.markers.forEach(({ lat, lon, title, bedrooms, price, id }) => {
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`
        <div style="
          font-family: sans-serif;
          min-width: 180px;
          padding: 10px;
          border-radius: 8px;
        ">
          <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 4px;">${title}</h3>
          <p style="margin: 0;">Bedrooms: <strong>${bedrooms}</strong></p>
          <p style="margin: 0 0 8px;">Price: <strong>£${(price ?? 0).toLocaleString()}</strong></p>
          <a href="/listing/${id}" style="
            display: inline-block;
            margin-top: 6px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
          ">View Listing</a>
        </div>
      `);
    });
  } else if (props.lat && props.lon) {
    // If no markers but lat/lon provided, add a single marker
    map.zoomControl.remove();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    const marker = L.marker([props.lat, props.lon]).addTo(map)
  }

  // Auto-zoom to bounds if multiple markers
  if (props.markers && props.markers.length > 1) {
    const bounds = L.latLngBounds(props.markers.map((m) => [m.lat, m.lon]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }
});
</script>
