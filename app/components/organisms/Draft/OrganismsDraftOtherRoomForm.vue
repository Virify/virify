<template>
  <OrganismsDraftBaseRoomForm>
  <div class="o-other-room-form">
    <div class="o-other-room-form__items">
      <div
        v-for="(otherRoomItem, index) in localOtherRooms"
        :key="index"
        :ref="(el) => setRoomRef(el, index)"
        class="o-other-room-form__item"
        :class="{ 'o-other-room-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Other Room ${index + 1}${otherRoomItem.name ? ' - ' + otherRoomItem.name : ''}`"
          :is-collapsed="!expandedRooms.has(index)"
          variant="inline"
          @toggle="toggleRoom(index)"
          class="o-other-room-form__item-title"
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

        <div v-else class="o-other-room-form__item-header">
          <h4 class="o-other-room-form__item-title | body-md font-semibold">Other Room {{ index + 1 }}</h4>
          <div class="o-other-room-form__item-actions">
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
          <div v-if="!isRoomCollapsed(index) || expandedRooms.has(index)" class="o-other-room-form__item-content">
            <div class="o-other-room-form__form-grid">
              <OrganismsDraftFormTextGroup
                title="Other Room Name"
                v-model="otherRoomItem.name"
                :name="`other-room-${index}-name`"
                placeholder="e.g. Home Office"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this room a descriptive name to help identify it (e.g. Home Office, Utility Room, Games Room)'
                  ]" />
                </template>
              </OrganismsDraftFormTextGroup>

              <OrganismsDraftFormTextGroup
                title="Other Room Description"
                v-model="otherRoomItem.description"
                :name="`other-room-${index}-description`"
                placeholder="Describe this room..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this room that buyers might find useful'
                  ]" />
                </template>
              </OrganismsDraftFormTextGroup>

              <OrganismsDraftFormNumberGroup
                title="Room Number"
                v-model="otherRoomItem.roomNumber"
                :name="`other-room-${index}-number`"
                placeholder="1"
                :required="true"
                :grid="true"
                min="1"
                step="1"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Assign a number to this room (e.g. Room 1, Room 2)'
                  ]" />
                </template>
              </OrganismsDraftFormNumberGroup>

              <OrganismsDraftFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="otherRoomItem.floor"
                :name="`other-room-${index}-floor`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select which floor this room is located on'
                  ]" />
                </template>
              </OrganismsDraftFormSelectGroup>

              <OrganismsDraftFormSelectGroup
                title="Room Type"
                :options="otherRoomTypeOptions"
                v-model="otherRoomItem.type"
                :name="`other-room-${index}-type`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select the type of room (e.g. Office, Utility, Gym, Playroom)'
                  ]" />
                </template>
              </OrganismsDraftFormSelectGroup>

              <OrganismsDraftFormSelectGroup
                title="Fireplace"
                :options="fireplaceSelectOptions"
                :model-value="getOtherRoomFireplaceValue(otherRoomItem)"
                @update:modelValue="setOtherRoomFireplaceValue(otherRoomItem, $event)"
                :name="`other-room-${index}-fireplace`"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select the type of fireplace if this room has one'
                  ]" />
                </template>
              </OrganismsDraftFormSelectGroup>
            </div>

            <OrganismsDraftFormCheckboxGroup
              title="Room Features"
              :options="otherRoomFeatureOptions"
              :model-value="getSelectedOtherRoomFeatures(otherRoomItem)"
              :name="`other-room-${index}-features`"
              @update:modelValue="updateOtherRoomFeatures(otherRoomItem, $event)"
            />

            <OrganismsDraftFormSizeToggle
              title="Room Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="otherRoomItem.size"
              :name="`other-room-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => (otherRoomItem.size = value)"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Enter the room\'s floor area (either in square meters, or square foot). If you\'re unsure how to measure the floor area, please visit our guides.'
                ]" />
              </template>
            </OrganismsDraftFormSizeToggle>

            <div class="o-other-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-secondary | body-sm"
                :disabled="!isRoomCompleted(otherRoomItem) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Room' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localOtherRooms.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <div class="o-other-room-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-secondary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Room' : '+ Add Room' }}
      </button>
    </div>
  </div>

  </OrganismsDraftBaseRoomForm>
</template>

<script setup lang="ts">
import type { OtherRoom } from '~~/layers/database/server/database/prisma/generated/client';

import { fireplaceSelectNoneValue, fireplaceSelectOptions, otherRoomFeatureOptions, otherRoomTypeOptions } from "../../../utils/draft/step-six";

const defaultOtherRoomType = otherRoomTypeOptions[0]?.value ?? null;

interface Props {
  modelValue: Omit<OtherRoom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const floorOptions = computed(() => getFloorOptions(props.totalFloors));

const localOtherRooms = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (room: any) =>
    Boolean(
      room.name &&
      room.roomNumber &&
      room.floor !== null &&
      room.floor !== undefined &&
      room.type
    ),
  createNewRoom: (roomNumber: number) => ({
    name: null,
    roomNumber,
    floor: 1,
    type: defaultOtherRoomType,
    fireplace: null,
    description: '',
    size: null,
    openPlan: false,
    openConcept: false,
    balcony: false,
    bayWindow: false,
    builtInShelving: false,
    hasView: false,
    patioDoors: false,
    builtInStorage: false,
    servingHatch: false,
    barArea: false,
    soundProofing: false,
    accousticPanels: false,
    stoneFlooring: false,
    hardwoodFlooring: false,
    builtInDesk: false,
  }),
};

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
  isNewUnsavedRoom,
} = useRoomManager(localOtherRooms, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

function getSelectedOtherRoomFeatures(room: any): string[] {
  const features: string[] = [];

  otherRoomFeatureOptions.forEach((option: { value: string }) => {
    if (room[option.value]) {
      features.push(option.value);
    }
  });

  return features;
}

function updateOtherRoomFeatures(room: any, selectedFeatures: string[]) {
  otherRoomFeatureOptions.forEach((option: { value: string }) => {
    room[option.value] = false;
  });

  selectedFeatures.forEach((feature) => {
    room[feature] = true;
  });
}

function getOtherRoomFireplaceValue(room: any): string {
  return room.fireplace ?? fireplaceSelectNoneValue;
}

function setOtherRoomFireplaceValue(room: any, value: string) {
  room.fireplace = value === fireplaceSelectNoneValue ? null : value;
}
</script>

