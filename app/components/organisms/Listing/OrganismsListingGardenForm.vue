<template>
  <OrganismsListingBaseRoomForm>
  <div class="o-garden-form">
    <div class="o-base-room-form__items">
      <div
        v-for="(garden, index) in localGardens"
        :key="index"
        :ref="(el) => setRoomRef(el, index)"
        class="o-base-room-form__item"
        :class="{ 'o-garden-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Garden ${index + 1}${garden.name ? ' - ' + garden.name : ''}`"
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
          <h4 class="o-base-room-form__item-title | body-md font-semibold">Garden {{ index + 1 }}</h4>
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
                title="Garden Name"
                v-model="garden.name"
                :name="`garden-${index}-name`"
                placeholder="e.g. Rear Garden"
                :grid="true"
                :required="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this garden space a descriptive name to help identify it (e.g. Rear Garden, Front Garden, Side Garden)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormTextGroup
                title="Garden Description"
                v-model="garden.description"
                :name="`garden-${index}-description`"
                placeholder="Describe this garden..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this garden that buyers might find useful (e.g. landscaping, features, maintenance)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormSelectGroup
                title="Position"
                :options="gardenPositionOptions"
                v-model="garden.position"
                :name="`garden-${index}-position`"
                :required="false"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select where this garden is located relative to the property (Front, Rear, or Side)'
                  ]" />
                </template>
              </OrganismsListingFormSelectGroup>

              <OrganismsListingFormSelectGroup
                title="Facing"
                :options="gardenFacingOptions"
                v-model="garden.facing"
                :name="`garden-${index}-facing`"
                :required="false"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select which direction this garden faces (affects sunlight throughout the day)'
                  ]" />
                </template>
              </OrganismsListingFormSelectGroup>
            </div>

            <OrganismsListingFormCheckboxGroup
              title="Garden Features"
              :options="gardenFeaturesOptions"
              :model-value="getSelectedGardenFeatures(garden)"
              :name="`garden-${index}-features`"
              @update:modelValue="updateGardenFeatures(garden, $event)"
            />

            <!-- Garden Size -->
            <OrganismsListingFormSizeToggle
              title="Garden Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="garden.size"
              :name="`garden-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => garden.size = value"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Enter the garden\'s area (either in square meters or square feet). Optional but helpful for potential buyers.'
                ]" />
              </template>
            </OrganismsListingFormSizeToggle>

            <div class="o-base-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-tertiary | body-sm"
                :disabled="!isRoomCompleted(garden) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Garden' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localGardens.length - 1" />
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
        {{ hasAnyRooms ? '+ Add Another Garden' : '+ Add Garden' }}
      </button>
    </div>
  </div>

  </OrganismsListingBaseRoomForm>
</template>

<script setup lang="ts">
import type { Garden } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  modelValue: Omit<Garden, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const localGardens = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (garden: any) =>
    Boolean(garden.name),
  createNewRoom: () => ({
    name: 'Garden',
    description: null,
    position: '0',
    facing: '0',
    sunTerrace: false,
    terrace: false,
    balcony: false,
    patio: false,
    separateParcel: false,
    shed: false,
    summerHouse: false,
    gardenOffice: false,
    pool: false,
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
} = useRoomManager(localGardens, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

// Garden features checkbox management
const getSelectedGardenFeatures = (garden: any) => {
  return garden.features || [];
};

const updateGardenFeatures = (garden: any, selectedFeatures: string[]) => {
  garden.features = selectedFeatures;
};
</script>

<style lang="scss" scoped>
.o-garden-form {
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
