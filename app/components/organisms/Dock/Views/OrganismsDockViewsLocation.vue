<template>
  <div class="| flow">
    <h2 class="| title-md">Location</h2>

    <MoleculesAiSearchFormLocation @location-selected="updateLocation" @radius-updated="updateLocationRadius"
      @form-submitted="updateFormSubmitted" />
  </div>
</template>

<script setup lang="ts">
function updateLocation(location: MaybeRef<GeocodingFeature>) {
  console.log('search-updated', {
    type: 'location',
    value: unref(location)
  })
}

function updateLocationRadius(radius: number) {
  console.log('search-updated', {
    type: 'radius',
    value: radius
  })
}

function updateFormSubmitted(radius: number) {
  console.log('search-updated', {
    type: 'submit'
  })
}
</script>