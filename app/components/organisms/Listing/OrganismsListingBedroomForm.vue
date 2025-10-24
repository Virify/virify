<template>
  <OrganismsListingBaseRoomForm>
    <div class="o-bedroom-form">
      <div class="o-base-room-form__items">
        <div 
          v-for="(bedroom, index) in localBedrooms" 
          :key="index"
          :ref="el => setRoomRef(el, index)"
          class="o-base-room-form__item"
          :class="{ 'o-base-room-form__item--collapsed': isRoomCollapsed(index) }"
        >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Bedroom ${index + 1}${bedroom.name ? ' - ' + bedroom.name : ''}`"
          :is-collapsed="!expandedRooms.has(index)"
          variant="inline"
          @toggle="toggleRoom(index)"
          class="o-base-room-form__item-title"
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
              v-if="!isNewUnsavedRoom(index)"
              type="button"
              @click.stop="toggleRoom(index)"
              class="button button-xs button-tertiary | body-xs"
            >
              {{ expandedRooms.has(index) ? 'Close' : 'Edit' }}
            </button>
          </template>
        </AtomsCollapsibleHeader>

        <div v-else class="o-base-room-form__item-header">
          <h4 class="o-bedroom-form__item-title | body-md font-semibold">Bedroom {{ index + 1 }}</h4>
          <div class="o-base-room-form__item-actions">
            <button
              type="button"
              @click="removeRoom(index)"
              class="button button-xs button-delete | body-xs"
            >
              Remove
            </button>
            <button
              v-if="!isNewUnsavedRoom(index)"
              type="button"
              @click="toggleRoom(index)"
              class="button button-xs button-tertiary | body-xs"
            >
              Close
            </button>
          </div>
        </div>

        <Transition name="accordion">
          <div v-if="!isRoomCollapsed(index) || expandedRooms.has(index)" class="o-base-room-form__item-content">
            <div class="o-base-room-form__form-grid">
              <!-- Bedroom Name -->
              <OrganismsListingFormTextGroup
                title="Bedroom Name"
                v-model="bedroom.name"
                :name="`bedroom-${index}-name`"
                placeholder="e.g. Master Bedroom, Guest Room"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this bedroom a descriptive name to help identify it (e.g. Master Bedroom, Guest Room, Front Bedroom)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <!-- Bedroom Description -->
              <OrganismsListingFormTextGroup
                title="Bedroom Description"
                v-model="bedroom.description"
                :name="`bedroom-${index}-description`"
                placeholder="Describe this bedroom..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this bedroom that buyers might find useful'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <!-- Bedroom Number -->
              <OrganismsListingFormNumberGroup
                title="Bedroom Number"
                v-model="bedroom.roomNumber"
                :name="`bedroom-${index}-number`"
                placeholder="1"
                :required="true"
                :grid="true"
                min="1"
                step="1"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Assign a number to this bedroom (e.g. Bedroom 1, Bedroom 2)'
                  ]" />
                </template>
              </OrganismsListingFormNumberGroup>

              <!-- Floor -->
              <OrganismsListingFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="bedroom.floor"
                :name="`bedroom-${index}-floor`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select which floor this bedroom is located on'
                  ]" />
                </template>
              </OrganismsListingFormSelectGroup>
            </div>

          <!-- Bed Size -->
          <OrganismsListingFormRadioGroup
            title="Bed Size"
            :options="bedSizeOptions"
            v-model="bedroom.bed[0]"
            :name="`bedroom-${index}-bed`"
            :required="true"
          >
            <template #tooltip-content>
              <AtomsTooltipParagraphs :paragraphs="[
                'Choose the largest bed size that fits comfortably in this room. This helps users understand available space.'
              ]" />
            </template>
          </OrganismsListingFormRadioGroup>

          <!-- Bedroom Features (Multi-select) -->
          <OrganismsListingFormCheckboxGroup
            title="Bedroom Features"
            :options="bedroomFeaturesOptions"
            :model-value="getSelectedBedroomFeatures(bedroom)"
            :name="`bedroom-${index}-features`"
            @update:modelValue="updateBedroomFeatures(bedroom, $event)"
          />

          <!-- Bedroom Size -->
          <OrganismsListingFormSizeToggle
            title="Bedroom Size"
            :options="sizeOptions"
            :unit="'meter'"
            :size="bedroom.size"
            :name="`bedroom-${index}-size`"
            @update:unit="() => {}"
            @update:size="(value: number | null) => bedroom.size = value"
          >
            <template #tooltip-content>
              <AtomsTooltipParagraphs :paragraphs="[
                'Enter the bedroom\'s floor area (either in square meters, or square foot). If you\'re unsure how to measure the floor area, please visit our guides.'
              ]" />
            </template>
          </OrganismsListingFormSizeToggle>

          <!-- Save/Done Button for the form -->
          <div class="o-base-room-form__form-actions">
            <button
              type="button"
              @click="saveRoom(index)"
              class="button button-sm button-secondary | body-sm"
              :disabled="!isRoomCompleted(bedroom) || !hasRoomChanges(index)"
            >
              {{ lastAddedRoomIndex === index ? 'Save Bedroom' : 'Save Changes' }}
            </button>
            <button
              type="button"
              @click="cancelRoom(index)"
              class="button button-sm button-tertiary | body-sm"
            >
              {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
            </button>
          </div>

          <AtomsDivider v-if="index < localBedrooms.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Add Bedroom Button -->
    <div class="o-base-room-form__add-item" v-show="!hasOpenRoomForm">
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
  </OrganismsListingBaseRoomForm>
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
  cancelRoom,
  removeRoom,
  initializeRoomManager,
  isRoomCompleted,
  isNewUnsavedRoom
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

