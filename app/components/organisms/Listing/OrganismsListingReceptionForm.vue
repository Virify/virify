<template>
  <OrganismsListingBaseRoomForm>
  <div class="o-reception-form">
    <div class="o-base-room-form__items">
      <div
        v-for="(receptionRoom, index) in localReceptions"
        :key="index"
        :ref="(el) => setRoomRef(el, index)"
        class="o-base-room-form__item"
        :class="{ 'o-reception-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Reception ${index + 1}${receptionRoom.name ? ' - ' + receptionRoom.name : ''}`"
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
          <h4 class="o-base-room-form__item-title | body-md font-semibold">Reception {{ index + 1 }}</h4>
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
              <OrganismsListingFormTextGroup
                title="Reception Name"
                v-model="receptionRoom.name"
                :name="`reception-${index}-name`"
                placeholder="e.g. Living Room"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <p>Name this room to help identify it (e.g. Front Living Room, Rear Dining Room, Lounge).</p>
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormTextGroup
                title="Reception Description"
                v-model="receptionRoom.description"
                :name="`reception-${index}-description`"
                placeholder="Describe this reception space..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <p>Add any additional details about this reception room that buyers might find useful.</p>
                </template>
              </OrganismsListingFormTextGroup>


              <OrganismsListingFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="receptionRoom.floor"
                :name="`reception-${index}-floor`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <p>Select which floor this reception room is located on.</p>
                </template>
              </OrganismsListingFormSelectGroup>

              <OrganismsListingFormSelectGroup
                title="Reception Type"
                :options="receptionTypeOptions"
                v-model="receptionRoom.type"
                :name="`reception-${index}-type`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <p>Select the type of reception room (e.g. Living Room, Dining Room, Study).</p>
                </template>
              </OrganismsListingFormSelectGroup>
            </div>

            <OrganismsListingFormCheckboxGroup
              title="Reception Features"
              :options="receptionFeatureOptions"
              :model-value="getSelectedReceptionFeatures(receptionRoom)"
              :name="`reception-${index}-features`"
              @update:modelValue="updateReceptionFeatures(receptionRoom, $event)"
            />

            <OrganismsListingFormSizeToggle
              title="Reception Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="receptionRoom.size"
              :name="`reception-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => (receptionRoom.size = value)"
            >
              <template #tooltip-content>
                <p>
                  Not sure how to measure? See our <NuxtLink to="/guides/property-information/room-sizing" target="_blank" rel="noopener" class="link">Room Sizing guide</NuxtLink>.
                </p>
              </template>
            </OrganismsListingFormSizeToggle>

            <div class="o-base-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-tertiary | body-sm"
                :disabled="!isRoomCompleted(receptionRoom) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Reception' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localReceptions.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <div class="o-base-room-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-tertiary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Reception' : '+ Add Reception' }}
      </button>
    </div>
  </div>

  </OrganismsListingBaseRoomForm>
</template>

<script setup lang="ts">
import type { Reception } from '~~/layers/database/server/database/prisma/generated/client';

const defaultReceptionType = receptionTypeOptions[0]?.value ?? null;

interface Props {
  modelValue: Omit<Reception, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const floorOptions = computed(() => getFloorOptions(props.totalFloors));

const localReceptions = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (reception: any) =>
    Boolean(
      reception.name &&
      reception.roomNumber &&
      reception.floor !== null &&
      reception.floor !== undefined &&
      reception.type
    ),
  createNewRoom: (roomNumber: number) => ({
    name: null,
    roomNumber,
    floor: 1,
    type: defaultReceptionType,
    description: '',
    size: null,
    features: [],
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
} = useRoomManager(localReceptions, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

function getSelectedReceptionFeatures(reception: any): string[] {
  return reception.features || [];
}

function updateReceptionFeatures(reception: any, selectedFeatures: string[]) {
  reception.features = selectedFeatures;
}
</script>

