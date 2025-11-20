<template>
  <OrganismsListingBaseRoomForm>
  <div class="o-bathroom-form">
    <div class="o-base-room-form__items">
      <div 
        v-for="(bathroom, index) in localBathrooms" 
        :key="index"
        :ref="el => setRoomRef(el, index)"
        class="o-base-room-form__item"
        :class="{ 'o-bathroom-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Bathroom ${index + 1}${bathroom.name ? ' - ' + bathroom.name : ''}`"
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
          <h4 class="o-base-room-form__item-title | body-md font-semibold">Bathroom {{ index + 1 }}</h4>
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
            <!-- Bathroom Name -->
            <OrganismsListingFormTextGroup
              title="Bathroom Name"
              v-model="bathroom.name"
              :name="`bathroom-${index}-name`"
              placeholder="e.g. Master En Suite, Guest Bathroom"
              :required="true"
              :grid="true"
            >
              <template #tooltip-content>
                <p>Name this room to help identify it (e.g. Master En Suite, Family Bathroom, Downstairs WC)</p>
              </template>
            </OrganismsListingFormTextGroup>

            <!-- Bathroom Description -->
            <OrganismsListingFormTextGroup
              title="Bathroom Description"
              v-model="bathroom.description"
              :name="`bathroom-${index}-description`"
              placeholder="Describe this bathroom..."
              :grid="true"
              :expanded="true"
            >
              <template #tooltip-content>
                <p>Add any additional details about this bathroom that buyers might find useful</p>
              </template>
            </OrganismsListingFormTextGroup>

            <!-- Bathroom Number -->
            <OrganismsListingFormNumberGroup
              title="Bathroom Number"
              v-model="bathroom.roomNumber"
              :name="`bathroom-${index}-number`"
              placeholder="1"
              :required="true"
              :grid="true"
              min="1"
              step="1"
            >
              <template #tooltip-content>
                <p>Assign a number to this bathroom (e.g. Bathroom 1, Bathroom 2) - This will help you keep track of the different bathrooms in your listing and be used to order them on your listing.</p>
              </template>
            </OrganismsListingFormNumberGroup>

            <!-- Floor -->
            <OrganismsListingFormSelectGroup
              title="Floor"
              :options="floorOptions"
              v-model="bathroom.floor"
              :name="`bathroom-${index}-floor`"
              :required="true"
              :grid="true"
            >
              <template #tooltip-content>
                <p>Select which floor this bathroom is located on</p>
              </template>
            </OrganismsListingFormSelectGroup>
          </div>

          <!-- Bathroom Features (Multi-select) -->
          <OrganismsListingFormCheckboxGroup
            title="Bathroom Features"
            :options="bathroomFeaturesOptions"
            :model-value="getSelectedBathroomFeatures(bathroom)"
            :name="`bathroom-${index}-features`"
            @update:modelValue="updateBathroomFeatures(bathroom, $event)"
          />

          <!-- Bathroom Size -->
          <OrganismsListingFormSizeToggle
            title="Bathroom Size"
            :options="sizeOptions"
            :unit="'meter'"
            :size="bathroom.size"
            :name="`bathroom-${index}-size`"
            @update:unit="() => {}"
            @update:size="(value: number | null) => bathroom.size = value"
          >
            <template #tooltip-content>
              <p>Not sure how to measure? See our <NuxtLink to="/guides/property-information/room-sizing" target="_blank" rel="noopener" class="link">Room Sizing guide</NuxtLink>.</p>
            </template>
          </OrganismsListingFormSizeToggle>

          <!-- Save/Done Button for the form -->
          <div class="o-base-room-form__form-actions">
            <button
              type="button"
              @click="saveRoom(index)"
              class="button button-sm button-secondary | body-sm"
              :disabled="!isRoomCompleted(bathroom) || !hasRoomChanges(index)"
            >
              {{ lastAddedRoomIndex === index ? 'Save Bathroom' : 'Save Changes' }}
            </button>
            <button
              type="button"
              @click="cancelRoom(index)"
              class="button button-sm button-tertiary | body-sm"
            >
              {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
            </button>
          </div>

          <AtomsDivider v-if="index < localBathrooms.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Add Bathroom Button -->
    <div class="o-base-room-form__add-item" v-show="!hasOpenRoomForm">
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

  </OrganismsListingBaseRoomForm>
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
    features: [],
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
} = useRoomManager(localBathrooms, emit, roomManagerConfig);

// Initialize with all bathrooms collapsed on load
onMounted(() => {
  initializeRoomManager();
});

function getSelectedBathroomFeatures(bathroom: any): string[] {
  return bathroom.features || [];
}

function updateBathroomFeatures(bathroom: any, selectedFeatures: string[]) {
  bathroom.features = selectedFeatures;
}
</script>

