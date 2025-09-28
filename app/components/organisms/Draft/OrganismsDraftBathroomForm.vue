<template>
  <div class="o-bathroom-form">
    <div class="o-bathroom-form__items">
      <div 
        v-for="(bathroom, index) in localBathrooms" 
        :key="index"
        :ref="el => setRoomRef(el, index)"
        class="o-bathroom-form__item"
        :class="{ 'o-bathroom-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Bathroom ${index + 1}${bathroom.name ? ' - ' + bathroom.name : ''}`"
          :is-collapsed="!expandedRooms.has(index)"
          variant="inline"
          @toggle="toggleRoom(index)"
          class="o-bathroom-form__item-title"
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

        <div v-else class="o-bathroom-form__item-header">
          <h4 class="o-bathroom-form__item-title | body-md font-semibold">Bathroom {{ index + 1 }}</h4>
          <div class="o-bathroom-form__item-actions">
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
          <div v-if="!isRoomCollapsed(index) || expandedRooms.has(index)" class="o-bathroom-form__item-content">
          <div class="o-bathroom-form__form-grid">
            <!-- Bathroom Name -->
            <OrganismsDraftFormTextGroup
              title="Bathroom Name"
              v-model="bathroom.name"
              :name="`bathroom-${index}-name`"
              placeholder="e.g. Master En Suite, Guest Bathroom"
              :required="true"
              :grid="true" 
            />

            <!-- Bathroom Description -->
            <OrganismsDraftFormTextGroup
              title="Bathroom Description"
              v-model="bathroom.description"
              :name="`bathroom-${index}-description`"
              placeholder="Describe this bathroom..."
              :grid="true"
              :expanded="true" 
            />

            <!-- Bathroom Number -->
            <OrganismsDraftFormNumberGroup
              title="Bathroom Number"
              v-model="bathroom.roomNumber"
              :name="`bathroom-${index}-number`"
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
              v-model="bathroom.floor"
              :name="`bathroom-${index}-floor`"
              :required="true"
              :grid="true"
            />
          </div>

          <!-- Bathroom Features (Multi-select) -->
          <OrganismsDraftFormCheckboxGroup
            title="Bathroom Features"
            :options="bathroomFeaturesOptions"
            :model-value="getSelectedBathroomFeatures(bathroom)"
            :name="`bathroom-${index}-features`"
            @update:modelValue="updateBathroomFeatures(bathroom, $event)"
          />

          <!-- Bathroom Size -->
          <OrganismsDraftFormSizeToggle
            title="Bathroom Size"
            :options="sizeOptions"
            :unit="'meter'"
            :size="bathroom.size"
            :name="`bathroom-${index}-size`"
            @update:unit="() => {}"
            @update:size="(value: number | null) => bathroom.size = value"
          />

          <!-- Save/Done Button for the form -->
          <div class="o-bathroom-form__form-actions">
            <button
              type="button"
              @click="saveRoom(index)"
              class="button button-sm button-secondary | body-sm"
              :disabled="!isRoomCompleted(bathroom) || !hasRoomChanges(index)"
            >
              {{ lastAddedRoomIndex === index ? 'Save Bathroom' : 'Save Changes' }}
            </button>
          </div>

          <AtomsDivider v-if="index < localBathrooms.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Add Bathroom Button -->
    <div class="o-bathroom-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-secondary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Bathroom' : '+ Add Bathroom' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bathroom } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  modelValue: Omit<Bathroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

// Computed floor options based on totalFloors
const floorOptions = computed(() => getFloorOptions(props.totalFloors));

// Use the actual modelValue - don't auto-create bathrooms
const localBathrooms = computed(() => {
  return props.modelValue;
});

// Room manager configuration
const roomManagerConfig = {
  isRoomCompleted: (bathroom: any) => Boolean(
    bathroom.name && 
    bathroom.roomNumber && 
    bathroom.floor !== null
  ),
  createNewRoom: (roomNumber: number) => ({
    name: null,
    roomNumber,
    floor: 1,
    description: '',
    toilet: false,
    enSuite: false,
    bathtub: true,
    walkInShower: false,
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
} = useRoomManager(localBathrooms, emit, roomManagerConfig);

// Initialize with all bathrooms collapsed on load
onMounted(() => {
  initializeRoomManager();
});

function getSelectedBathroomFeatures(bathroom: any): string[] {
  const features: string[] = [];
  
  bathroomFeaturesOptions.forEach((option: { value: string; key: string; info: string }) => {
    if (bathroom[option.value]) {
      features.push(option.value);
    }
  });
  
  return features;
}

function updateBathroomFeatures(bathroom: any, selectedFeatures: string[]) {
  // Reset all features to false
  bathroomFeaturesOptions.forEach((option: { value: string; key: string; info: string }) => {
    bathroom[option.value] = false;
  });
  
  // Set selected features to true
  selectedFeatures.forEach(feature => {
    bathroom[feature] = true;
  });
}
</script>

<style lang="scss">
.o-bathroom-form {
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