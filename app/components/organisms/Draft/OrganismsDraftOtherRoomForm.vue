<template>
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
              />

              <OrganismsDraftFormTextGroup
                title="Other Room Description"
                v-model="otherRoomItem.description"
                :name="`other-room-${index}-description`"
                placeholder="Describe this room..."
                :grid="true"
                :expanded="true"
              />

              <OrganismsDraftFormNumberGroup
                title="Room Number"
                v-model="otherRoomItem.roomNumber"
                :name="`other-room-${index}-number`"
                placeholder="1"
                :required="true"
                :grid="true"
                min="1"
                step="1"
              />

              <OrganismsDraftFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="otherRoomItem.floor"
                :name="`other-room-${index}-floor`"
                :required="true"
                :grid="true"
              />

              <OrganismsDraftFormSelectGroup
                title="Room Type"
                :options="otherRoomTypeOptions"
                v-model="otherRoomItem.type"
                :name="`other-room-${index}-type`"
                :required="true"
                :grid="true"
              />

              <OrganismsDraftFormSelectGroup
                title="Fireplace"
                :options="fireplaceSelectOptions"
                :model-value="getOtherRoomFireplaceValue(otherRoomItem)"
                @update:modelValue="setOtherRoomFireplaceValue(otherRoomItem, $event)"
                :name="`other-room-${index}-fireplace`"
                :grid="true"
              />
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
            />

            <div class="o-other-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-secondary | body-sm"
                :disabled="!isRoomCompleted(otherRoomItem) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Room' : 'Save Changes' }}
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
  removeRoom,
  initializeRoomManager,
  isRoomCompleted,
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

<style lang="scss">
.o-other-room-form {
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
