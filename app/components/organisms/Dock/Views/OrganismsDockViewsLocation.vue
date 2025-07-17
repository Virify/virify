<template>
  <div class="| flow">
    <h2 class="| title-md">Location</h2>

    <MoleculesAiSearchFormLocation @location-selected="updateLocation" @radius-updated="updateLocationRadius" />
  </div>
</template>

<script setup lang="ts">

function updateLocation(location: GeocodingFeature) {
  console.log('Location set!', unref(location))
}

function updateLocationRadius(radius: number) {
  console.log('Radius updated!', radius)
}
</script>