<template>
  <div v-if="drawEnabled" class="m-map-draw-controls">
    <div class="m-map-draw-controls-group">
      <!-- Polygon Drawing Toggle Button -->
      <div class="m-map-draw-controls-item">
        <AtomsButton
          :class="[
            'button-overlay',
            'm-map-draw-controls-button',
            { 'm-map-draw-controls-button-active': isDrawing }
          ]"
          :aria-pressed="isDrawing"
          :aria-label="isDrawing ? 'Stop drawing polygon' : 'Start drawing polygon'"
          @click="togglePolygonDrawing"
        >
          <AtomsIcon 
            icon="draw" 
            :title="isDrawing ? 'Stop drawing' : 'Draw new shape'"
          />
        </AtomsButton>
        <div class="m-map-draw-controls-label | body-xs font-medium">
          {{ isDrawing ? 'Stop drawing' : 'Draw new shape' }}
        </div>
      </div>

      <!-- Delete Selected Shape Button (only show when a shape is selected) -->
      <div v-if="hasSelectedShape" class="m-map-draw-controls-item">
        <AtomsButton
          class="button-overlay m-map-draw-controls-button"
          :aria-label="'Delete selected shape'"
          @click="deleteSelectedShape"
        >
          <AtomsIcon 
            icon="cross" 
            title="Delete selected shape"
          />
        </AtomsButton>
        <div class="m-map-draw-controls-label | body-xs font-medium">Delete selected</div>
      </div>

      <!-- Delete All Shapes Button -->
      <div v-else class="m-map-draw-controls-item">
        <AtomsButton
          class="button-overlay m-map-draw-controls-button"
          :disabled="!hasDrawnShapes"
          :aria-label="hasDrawnShapes ? 'Delete all shapes' : 'No shapes to delete'"
          @click="deleteAllShapes"
        >
          <AtomsIcon 
            icon="cross" 
            title="Delete all shapes"
          />
        </AtomsButton>
        <div class="m-map-draw-controls-label | body-xs font-medium">
          {{ hasDrawnShapes ? 'Delete all' : 'No shapes' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  drawEnabled: boolean;
  isDrawing?: boolean;
  hasDrawnShapes?: boolean;
  hasSelectedShape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDrawing: false,
  hasDrawnShapes: false,
  hasSelectedShape: false,
});

interface Emits {
  (e: 'toggle-polygon-drawing'): void;
  (e: 'delete-all-shapes'): void;
  (e: 'delete-selected-shape'): void;
}

const emit = defineEmits<Emits>();

/**
 * Handle polygon drawing toggle
 */
function togglePolygonDrawing() {
  emit('toggle-polygon-drawing');
}

/**
 * Handle delete all shapes
 */
function deleteAllShapes() {
  if (props.hasDrawnShapes) {
    emit('delete-all-shapes');
  }
}

/**
 * Handle delete selected shape
 */
function deleteSelectedShape() {
  emit('delete-selected-shape');
}
</script>

<style lang="scss" scoped>
.m-map-draw-controls {
  position: absolute;
  top: var(--size-16);
  left: var(--size-16);
  z-index: 10;
  pointer-events: none;
}

.m-map-draw-controls-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
  pointer-events: auto;
}

.m-map-draw-controls-button {
  width: var(--size-56);
  height: var(--size-56);
  background: var(--background-100);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all var(--animation-fast);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: var(--size-24);
    height: var(--size-24);
  }
}

.m-map-draw-controls-button-active {
  background-color: var(--secondary-500) !important;
  color: var(--monochrome-100) !important;

  &:hover {
    background-color: var(--secondary-600) !important;
  }
}

.m-map-draw-controls-item {
  display: flex;
  align-items: center;
  gap: var(--size-8);
}

.m-map-draw-controls-label {
  background: var(--background-100);
  color: var(--text-primary);
  padding: var(--size-8) var(--size-12);
  border-radius: var(--border-radius-md);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  user-select: none;
}
</style>
