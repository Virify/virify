<template>
  <div class="o-bedroom-form">
    <div class="o-bedroom-form__items">
      <div 
        v-for="(bedroom, index) in localBedrooms" 
        :key="index"
        :ref="el => setRoomRef(el, index)"
        class="o-bedroom-form__item"
        :class="{ 'o-bedroom-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Bedroom ${index + 1}${bedroom.name ? ' - ' + bedroom.name : ''}`"
          :is-collapsed="!expandedRooms.has(index)"
          variant="inline"
          @toggle="toggleRoom(index)"
          class="o-bedroom-form__item-title"
        >
          <template #actions>
            <button
              type="button"
              @click.stop="removeRoom(index)"
              class="button button-xs button-delete | body-xs"
            >
              Remove
            </button>
            <button
              type="button"
              @click.stop="toggleRoom(index)"
              class="button button-xs button-tertiary | body-xs"
            >
              {{ expandedRooms.has(index) ? 'Close' : 'Edit' }}
            </button>
          </template>
        </AtomsCollapsibleHeader>

        <div v-else class="o-bedroom-form__item-header">
          <h4 class="o-bedroom-form__item-title | body-md font-semibold">Bedroom {{ index + 1 }}</h4>
          <div class="o-bedroom-form__item-actions">
            <button
              type="button"
              @click="removeRoom(index)"
              class="button button-xs button-delete | body-xs"
            >
              Remove
            </button>
            <button
              type="button"
              @click="toggleRoom(index)"
              class="button button-xs button-tertiary | body-xs"
            >
              Close
            </button>
          </div>
        </div>

        <Transition name="accordion">
          <div v-if="!isRoomCollapsed(index) || expandedRooms.has(index)" class="o-bedroom-form__item-content">
            <div class="o-bedroom-form__form-grid">
              <!-- Bedroom Name -->
              <OrganismsDraftFormTextGroup
                title="Bedroom Name"
                v-model="bedroom.name"
                :name="`bedroom-${index}-name`"
                placeholder="e.g. Master Bedroom, Guest Room"
                :required="true"
                :grid="true" 
              />

              <!-- Bedroom Description -->
              <OrganismsDraftFormTextGroup
                title="Bedroom Description"
                v-model="bedroom.description"
                :name="`bedroom-${index}-description`"
                placeholder="Describe this bedroom..."
                :grid="true"
                :expanded="true" 
              />

              <!-- Bedroom Number -->
              <OrganismsDraftFormNumberGroup
                title="Bedroom Number"
                v-model="bedroom.roomNumber"
                :name="`bedroom-${index}-number`"
                placeholder="1"
                :required="true"
                :grid="true"
                min="1"
                step="1"
              />

              <!-- Floor -->
              <OrganismsDraftFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="bedroom.floor"
                :name="`bedroom-${index}-floor`"
                :required="true"
                :grid="true"
              />
            </div>

          <!-- Bed Size -->
          <OrganismsDraftFormRadioGroup
            title="Bed Size"
            :options="bedSizeOptions"
            v-model="bedroom.bed[0]"
            :name="`bedroom-${index}-bed`"
            :required="true"
          />

          <!-- Bedroom Features (Multi-select) -->
          <OrganismsDraftFormCheckboxGroup
            title="Bedroom Features"
            :options="bedroomFeaturesOptions"
            :model-value="getSelectedBedroomFeatures(bedroom)"
            :name="`bedroom-${index}-features`"
            @update:modelValue="updateBedroomFeatures(bedroom, $event)"
          />

          <!-- Bedroom Size -->
          <OrganismsDraftFormSizeToggle
            title="Bedroom Size"
            :options="sizeOptions"
            :unit="'meter'"
            :size="bedroom.size"
            :name="`bedroom-${index}-size`"
            @update:unit="() => {}"
            @update:size="(value: number | null) => bedroom.size = value"
          />

          <!-- Save/Done Button for the form -->
          <div class="o-bedroom-form__form-actions">
            <button
              type="button"
              @click="saveRoom(index)"
              class="button button-sm button-secondary | body-sm"
              :disabled="!isRoomCompleted(bedroom) || !hasRoomChanges(index)"
            >
              {{ lastAddedRoomIndex === index ? 'Save Bedroom' : 'Save Changes' }}
            </button>
          </div>

          <AtomsDivider v-if="index < localBedrooms.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Add Bedroom Button -->
    <div class="o-bedroom-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-secondary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Bedroom' : '+ Add Bedroom' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bedroom } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  modelValue: Omit<Bedroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

// Computed floor options based on totalFloors
const floorOptions = computed(() => getFloorOptions(props.totalFloors));

// Use the actual modelValue - don't auto-create bedrooms
const localBedrooms = computed(() => {
  return props.modelValue;
});

// Room manager configuration
const roomManagerConfig = {
  isRoomCompleted: (bedroom: any) => Boolean(
    bedroom.name && 
    bedroom.roomNumber && 
    bedroom.floor && 
    bedroom.bed.length > 0
  ),
  createNewRoom: (roomNumber: number) => ({
    name: null,
    roomNumber,
    floor: 1,
    bed: [],
    description: null,
    enSuite: false,
    builtInStorage: false,
    walkInWardrobe: false,
    bayWindow: false,
    balcony: false,
    hasView: false,
    patioDoors: false,
    builtInDesk: false,
    size: null,
  })
};

// Use room manager
const {
  expandedRooms,
  roomRefs,
  lastAddedRoomIndex,
  hasAnyRooms,
  hasOpenRoomForm,
  addButtonDisabled,
  setRoomRef,
  isRoomCollapsed,
  toggleRoom,
  hasRoomChanges,
  addRoom,
  saveRoom,
  removeRoom,
  initializeRoomManager,
  isRoomCompleted
} = useRoomManager(localBedrooms, emit, roomManagerConfig);

// Initialize with all bedrooms collapsed on load
onMounted(() => {
  initializeRoomManager();
});

function getSelectedBedroomFeatures(bedroom: any): string[] {
  const features: string[] = [];
  
  bedroomFeaturesOptions.forEach((option: { value: string; key: string; info: string }) => {
    if (bedroom[option.value]) {
      features.push(option.value);
    }
  });
  
  return features;
}

function updateBedroomFeatures(bedroom: any, selectedFeatures: string[]) {
  // Reset all features to false
  bedroomFeaturesOptions.forEach((option: { value: string; key: string; info: string }) => {
    bedroom[option.value] = false;
  });
  
  // Set selected features to true
  selectedFeatures.forEach(feature => {
    bedroom[feature] = true;
  });
}
</script>

<style lang="scss">
.o-bedroom-form {
  &__items {
    display: flex;
    flex-direction: column;
  }
  
  &__item {
    padding: var(--size-16) 0;
    border: 1px solid var(--border-200);
    border-radius: var(--radius-lg);
    background: var(--background-50);
    
    &--collapsed {
      background: var(--background-25);
      border-color: var(--border-100);
      
      .collapsible-header {
        margin-bottom: 0;
      }
    }
  }
  
  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--size-16);
    border-bottom: 1px solid var(--border-100);
  }
  
  &__item-actions {
    display: flex;
    gap: var(--size-8);
    align-items: center;
  }
  
  &__item-title {
    color: var(--secondary-400);
  }
  
  &__item-content {
    overflow: hidden;
  }
  
  // Vue transition classes for accordion
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 1000px;
    opacity: 1;
  }
  
  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }
  
  &__form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-24);
    margin-bottom: var(--size-24);
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .o-form-group {
      padding: 0;
    }
  }
  
  &__form-actions {
    display: flex;
    justify-content: center;
    margin-top: var(--size-24);
    margin-bottom: var(--size-24);
  }
  
  &__add-item {
    display: flex;
    justify-content: center;
  }
}
</style>