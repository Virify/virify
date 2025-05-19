<template>
  <div class="price-marker">
    <div class="price-marker-content">
      <span class="price-marker-price">{{ priceDisplay }}</span>
      <div v-if="isFavorite || hasNote" class="marker-status-container">
        <div v-if="isFavorite" class="marker-favorite-indicator">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white" stroke="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div v-if="hasNote" class="marker-note-indicator">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white" stroke="white">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarkerProps {
  price: number | null;
  hasNote: boolean;
  isFavorite: boolean;
}

const props = defineProps<MarkerProps>();

// Format price as £XXk if >= 10000, otherwise just format with commas
const priceDisplay = computed(() => {
  if (props.price === null || props.price === undefined) {
    return "";
  }
  return props.price >= 10000 
    ? `£${Math.round(props.price / 1000)}k` 
    : `£${props.price.toLocaleString()}`;
});
</script>

<style scoped>
.price-marker {
  border-radius: 8px;
  background: var(--secondary-400);
  color: white;
  padding: 4px 8px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  position: relative;
}

.price-marker-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.marker-status-container {
  display: flex;
  gap: 4px;
  margin-left: 4px;
}

.marker-favorite-indicator,
.marker-note-indicator {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add pointer triangle at bottom */
.price-marker:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: calc(50% - 8px);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--secondary-400);
}
</style>
