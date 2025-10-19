<template>
  <OrganismsListingBaseRoomForm>
    <div class="o-land-form">
      <div class="o-base-room-form__items">
        <div
          v-for="(land, index) in localLands"
          :key="index"
          :ref="(el) => setRoomRef(el, index)"
          class="o-base-room-form__item"
        :class="{ 'o-land-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Land ${index + 1}${land.name ? ' - ' + land.name : ''}`"
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
          <h4 class="o-base-room-form__item-title | body-md font-semibold">Land {{ index + 1 }}</h4>
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
                title="Land Name"
                v-model="land.name"
                :name="`land-${index}-name`"
                placeholder="e.g. Paddock, Woodland"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this land parcel a descriptive name to help identify it (e.g. Paddock, Woodland, Field)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormTextGroup
                title="Land Description"
                v-model="land.description"
                :name="`land-${index}-description`"
                placeholder="Describe this land parcel..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this land parcel that buyers might find useful (e.g. size, terrain, current use)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>
            </div>

            <OrganismsListingFormCheckboxGroup
              title="Land Features"
              :options="landFeaturesOptions"
              :model-value="getSelectedLandFeatures(land)"
              :name="`land-${index}-features`"
              @update:modelValue="updateLandFeatures(land, $event)"
            />

            <!-- Land Size -->
            <OrganismsListingFormSizeToggle
              title="Land Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="land.size"
              :name="`land-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => land.size = value"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Enter the land parcel\'s area (either in square meters or square feet). Optional but helpful for potential buyers.'
                ]" />
              </template>
            </OrganismsListingFormSizeToggle>

            <div class="o-base-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-secondary | body-sm"
                :disabled="!isRoomCompleted(land) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Land' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localLands.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <div class="o-base-room-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-secondary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Land Parcel' : '+ Add Land Parcel' }}
      </button>
    </div>
  </div>
  </OrganismsListingBaseRoomForm>
</template>

<script setup lang="ts">
import type { Land } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  modelValue: Omit<Land, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const localLands = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (land: any) =>
    Boolean(land.name),
  createNewRoom: () => ({
    name: 'Land',
    description: null,
    separateParcel: false,
    woodland: false,
    paddock: false,
    stables: false,
    tennisCourt: false,
    orchard: false,
    pond: false,
    outbuilding: false,
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
  isNewUnsavedRoom,
  isRoomCompleted,
} = useRoomManager(localLands, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

// Land features checkbox management
const getSelectedLandFeatures = (land: any) => {
  const features: string[] = [];
  landFeaturesOptions.forEach((option) => {
    if (land[option.value]) {
      features.push(option.value);
    }
  });
  return features;
};

const updateLandFeatures = (land: any, selectedFeatures: string[]) => {
  landFeaturesOptions.forEach((option) => {
    land[option.value] = false;
  });
  selectedFeatures.forEach((feature) => {
    land[feature] = true;
  });
};
</script>

<style lang="scss" scoped>
.o-land-form {
  &__items {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  &__item {
    border: 1px solid var(--border-200);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    transition: all 0.2s ease;

    &--collapsed {
      padding: 0;
      border: none;
    }
  }

  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  &__item-title {
    margin: 0;
  }

  &__item-actions {
    display: flex;
    gap: var(--space-xs);
  }

  &__item-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  &__form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__form-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--border-200);
  }

  &__add-item {
    display: flex;
    justify-content: center;
    margin-top: var(--space-md);
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
