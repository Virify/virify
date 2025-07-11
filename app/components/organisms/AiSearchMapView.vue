<template>
  <div class="ai-search-map-view">
    <Map
      ref="mapRef"
      :markers="convertedMarkers"
      :zoom="mapZoom"
      :center="mapCenter"
      :interactive="true"
      :mapId="GLOBAL_MAP_ID"
    />
  </div>
</template>

<script setup lang="ts">

interface Props {
  results: ListingWithFullProperty[];
  location: GeocodingFeature | null;
  radius: number;
}

const props = defineProps<Props>();

const { calculateZoomLevelFromRadius, updateSearchRadiusVisualization } = useMap();

const mapRef = ref();

// Convert ListingWithFullProperty to ListingCardType format that Map component expects
const convertedMarkers = computed((): ListingCardType[] => {
  return props.results
    .filter(listing => listing.property?.address?.lat && listing.property?.address?.lon)
    .map((listing, index) => ({
      id: listing.id || `listing-${index}`,
      title: listing.title,
      price: listing.price,
      listingTier: listing.listingTier,
      publishedAt: listing.publishedAt,
      rentalListing: listing.rentalListing,
      saleListing: listing.saleListing,
      property: {
        address: listing.property?.address ? {
          id: listing.property.address.id,
          number: listing.property.address.number,
          flat: listing.property.address.flat,
          street: listing.property.address.street,
          city: listing.property.address.city,
          postcode: listing.property.address.postcode,
          country: listing.property.address.country,
          county: listing.property.address.county,
          fullAddress: listing.property.address.fullAddress,
          lat: listing.property.address.lat,
          lon: listing.property.address.lon,
        } : null,
        media: listing.property?.media || [],
        type: listing.property?.type || null,
        classification: listing.property?.classification || null,
        numberBedrooms: listing.property?.numberBedrooms || null,
        numberBathrooms: listing.property?.numberBathrooms || null,
        numberReceptions: listing.property?.numberReceptions || null,
        accessibilityFeatures: listing.property?.accessibilityFeatures || null,
        additionalFeatures: listing.property?.additionalFeatures || null,
        parking: listing.property?.parking || null,
        outdoorSpace: listing.property?.outdoorSpace || null,
      },
      user: listing.user,
    } as ListingCardType));
});

// Calculate map center from location
const mapCenter = computed(() => {
  if (props.location) {
    return [props.location.geometry.coordinates[0], props.location.geometry.coordinates[1]] as [number, number];
  }
  return undefined; // Let Map component use defaults
});

// Calculate zoom from radius
const mapZoom = computed(() => {
  if (props.location && props.radius) {
    return calculateZoomLevelFromRadius(props.radius);
  }
  return undefined; // Let Map component use defaults
});

// Manually add radius visualization when map is ready
onMounted(() => {
  // Wait for map to be fully mounted
  nextTick(() => {
    setTimeout(() => {
      if (mapRef.value?.map && props.location && props.radius) {
        const center = [props.location.geometry.coordinates[0], props.location.geometry.coordinates[1]] as [number, number];
        console.log('[AiSearchMapView] Manually adding radius visualization:', {
          center,
          radius: props.radius,
          mapInstance: mapRef.value.map
        });
        updateSearchRadiusVisualization(mapRef.value.map, center, props.radius);
      }
    }, 500); // Give map time to fully initialize
  });
});

// Watch for prop changes and update radius
watch([() => props.location, () => props.radius], ([newLocation, newRadius]) => {
  if (mapRef.value?.map && newLocation && newRadius) {
    const center = [newLocation.geometry.coordinates[0], newLocation.geometry.coordinates[1]] as [number, number];
    updateSearchRadiusVisualization(mapRef.value.map, center, newRadius);
  }
});
</script>

<style lang="scss">
.ai-search-map-view {
  width: 100%;
  height: 70vh;
  min-height: 500px;
  border-radius: var(--border-radius-2xl);
  overflow: hidden;
}

@media (max-width: 768px) {
  .ai-search-map-view {
    height: 60vh;
    min-height: 400px;
  }
}
</style>