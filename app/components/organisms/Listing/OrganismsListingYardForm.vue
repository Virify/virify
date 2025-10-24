<template>
  <OrganismsListingBaseRoomForm>
  <div class="o-yard-form">
    <div class="o-base-room-form__items">
      <div
        v-for="(yard, index) in localYards"
        :key="index"
        :ref="(el) => setRoomRef(el, index)"
        class="o-base-room-form__item"
        :class="{ 'o-yard-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Yard ${index + 1}${yard.name ? ' - ' + yard.name : ''}`"
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
          <h4 class="o-base-room-form__item-title | body-md font-semibold">Yard {{ index + 1 }}</h4>
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
                title="Yard Name"
                v-model="yard.name"
                :name="`yard-${index}-name`"
                placeholder="e.g. Front Yard"
                :grid="true"
                :required="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this yard space a descriptive name to help identify it (e.g. Front Yard, Back Yard, Side Yard)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormTextGroup
                title="Yard Description"
                v-model="yard.description"
                :name="`yard-${index}-description`"
                placeholder="Describe this yard..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this yard that buyers might find useful (e.g. paving, features, maintenance)'
                  ]" />
                </template>
              </OrganismsListingFormTextGroup>

              <OrganismsListingFormSelectGroup
                title="Position"
                :options="gardenPositionOptions"
                v-model="yard.position"
                :name="`yard-${index}-position`"
                :required="false"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select where this yard is located relative to the property (Front, Rear, or Side)'
                  ]" />
                </template>
              </OrganismsListingFormSelectGroup>

              <OrganismsListingFormSelectGroup
                title="Facing"
                :options="gardenFacingOptions"
                v-model="yard.facing"
                :name="`yard-${index}-facing`"
                :required="false"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select which direction this yard faces (affects sunlight throughout the day)'
                  ]" />
                </template>
              </OrganismsListingFormSelectGroup>
            </div>

            <OrganismsListingFormCheckboxGroup
              title="Yard Features"
              :options="yardFeaturesOptions"
              :model-value="getSelectedYardFeatures(yard)"
              :name="`yard-${index}-features`"
              @update:modelValue="updateYardFeatures(yard, $event)"
            />

            <!-- Yard Size -->
            <OrganismsListingFormSizeToggle
              title="Yard Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="yard.size"
              :name="`yard-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => yard.size = value"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Enter the yard\'s area (either in square meters or square feet). Optional but helpful for potential buyers.'
                ]" />
              </template>
            </OrganismsListingFormSizeToggle>

            <div class="o-base-room-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-secondary | body-sm"
                :disabled="!isRoomCompleted(yard) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Yard' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localYards.length - 1" />
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
        {{ hasAnyRooms ? '+ Add Another Yard' : '+ Add Yard' }}
      </button>
    </div>
  </div>

  </OrganismsListingBaseRoomForm>
</template>

<script setup lang="ts">
import type { Yard } from '~~/layers/database/server/database/prisma/generated/client';
const defaultYardPosition = gardenPositionOptions[0]?.value ?? null;
const defaultYardFacing = gardenFacingOptions[0]?.value ?? null;

interface Props {
  modelValue: Omit<Yard, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const localYards = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (yard: any) =>
    Boolean(yard.name),
  createNewRoom: () => ({
    name: 'Yard',
    description: null,
    position: defaultYardPosition,
    facing: defaultYardFacing,
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
} = useRoomManager(localYards, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

// Yard features checkbox management
const getSelectedYardFeatures = (yard: any) => {
  const features: string[] = [];
  yardFeaturesOptions.forEach((option) => {
    if (yard[option.value]) {
      features.push(option.value);
    }
  });
  return features;
};

const updateYardFeatures = (yard: any, selectedFeatures: string[]) => {
  yardFeaturesOptions.forEach((option) => {
    yard[option.value] = false;
  });
  selectedFeatures.forEach((feature) => {
    yard[feature] = true;
  });
};
</script>

<style lang="scss" scoped>
.o-yard-form {
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
