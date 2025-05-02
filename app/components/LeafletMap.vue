<template>
  <LMap
    v-if="center"
    style="height: 350px; width: 100%"
    :zoom="zoom || 12"
    :center="[51.481583, -3.1791]"
  >
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <!-- If multiple markers -->
    <LMarker
      v-for="marker in markers"
      :key="marker.id!"
      :lat-lng="[marker.lat, marker.lon]"
    >
      <LPopup>
        <strong>{{ marker.title }}</strong><br />
        Bedrooms: {{ marker.bedrooms }}<br />
        Price: £{{ marker.price?.toLocaleString() }}
        <NuxtLink :to="`/listing/${marker.id}`">View Listing</NuxtLink>
      </LPopup>
    </LMarker>

    <!-- If just single lat/lon, no popup -->
    <LMarker
      v-if="!markers?.length && lat !== undefined && lon !== undefined"
      :lat-lng="[lat, lon]"
    />
  </LMap>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";

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
  zoom?: number;
}>();

const center = computed(() => {
  if (props.markers?.length) {
    return props.markers[0] ? [props.markers[0].lat, props.markers[0].lon] as [number, number] : undefined;
  } else if (props.lat !== undefined && props.lon !== undefined) {
    return [props.lat, props.lon] as [number, number];
  }
  return undefined;
});
</script>
