<template>
  <div class="popup-wrapper">
    <MoleculesSummaryCard :listing="marker" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  marker: MapMarker;
}>();
</script>

<style lang="scss">
/* MapLibre popup overrides */
.maplibregl-popup-content {
  background: transparent !important;
  width: var(--size-280) !important;
  max-width: var(--size-280) !important;
  min-width: var(--size-280) !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  pointer-events: auto !important;
  transform: translateY(-2px) !important;
}

.maplibregl-popup {
  z-index: 4;
}

.maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--monochrome-300) !important;
}

/* Featured popup tip colors */
.maplibregl-popup:has(.summary-card--featured).maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.summary-card--featured).maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.summary-card--featured).maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.summary-card--featured).maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--primary-400) !important;
}

/* Premium popup tip colors - specific to each anchor position */
.maplibregl-popup:has(.summary-card--premium).maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--secondary--400) !important;
}

.maplibregl-popup:has(.summary-card--premium).maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--secondary--400) !important;
}

.maplibregl-popup:has(.summary-card--premium).maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--secondary--400) !important;
}

.maplibregl-popup:has(.summary-card--premium).maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--secondary--400) !important;
}

.maplibregl-popup-anchor-top-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-top-right .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip {
  display: none !important;
}

.maplibregl-popup-close-button {
  display: none !important;
}

/* Target the popup element directly to override inline styles */
.maplibregl-popup[style] {
  max-width: none !important;
}

.maplibregl-popup-content[style] {
  max-width: 280px !important;
  width: 280px !important;
}

.popup-wrapper {
  position: relative;
  background: transparent;
  padding: 0;
  margin: 0;
  border: none;
  box-shadow: none;
}
</style>
