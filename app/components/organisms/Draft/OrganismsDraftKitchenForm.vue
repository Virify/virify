<template>
  <div class="o-kitchen-form">
    <div class="o-kitchen-form__items">
      <div
        v-for="(kitchen, index) in localKitchens"
        :key="index"
        :ref="(el) => setRoomRef(el, index)"
        class="o-kitchen-form__item"
        :class="{ 'o-kitchen-form__item--collapsed': isRoomCollapsed(index) }"
      >
        <AtomsCollapsibleHeader
          v-if="isRoomCollapsed(index)"
          :title="`Kitchen ${index + 1}${kitchen.name ? ' - ' + kitchen.name : ''}`"
          :is-collapsed="!expandedRooms.has(index)"
          variant="inline"
          @toggle="toggleRoom(index)"
          class="o-kitchen-form__item-title"
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

        <div v-else class="o-kitchen-form__item-header">
          <h4 class="o-kitchen-form__item-title | body-md font-semibold">Kitchen {{ index + 1 }}</h4>
          <div class="o-kitchen-form__item-actions">
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
          <div v-if="!isRoomCollapsed(index) || expandedRooms.has(index)" class="o-kitchen-form__item-content">
            <div class="o-kitchen-form__form-grid">
              <OrganismsDraftFormTextGroup
                title="Kitchen Name"
                v-model="kitchen.name"
                :name="`kitchen-${index}-name`"
                placeholder="e.g. Main Kitchen"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Give this kitchen a descriptive name to help identify it (e.g. Main Kitchen, Utility Kitchen)'
                  ]" />
                </template>
              </OrganismsDraftFormTextGroup>

              <OrganismsDraftFormTextGroup
                title="Kitchen Description"
                v-model="kitchen.description"
                :name="`kitchen-${index}-description`"
                placeholder="Describe this kitchen..."
                :grid="true"
                :expanded="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Add any additional details about this kitchen that buyers might find useful'
                  ]" />
                </template>
              </OrganismsDraftFormTextGroup>

              <OrganismsDraftFormNumberGroup
                title="Kitchen Number"
                v-model="kitchen.roomNumber"
                :name="`kitchen-${index}-number`"
                placeholder="1"
                :required="true"
                :grid="true"
                min="1"
                step="1"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Assign a number to this kitchen (e.g. Kitchen 1, Kitchen 2)'
                  ]" />
                </template>
              </OrganismsDraftFormNumberGroup>

              <OrganismsDraftFormSelectGroup
                title="Floor"
                :options="floorOptions"
                v-model="kitchen.floor"
                :name="`kitchen-${index}-floor`"
                :required="true"
                :grid="true"
              >
                <template #tooltip-content>
                  <AtomsTooltipParagraphs :paragraphs="[
                    'Select which floor this kitchen is located on'
                  ]" />
                </template>
              </OrganismsDraftFormSelectGroup>
            </div>

            <OrganismsDraftFormCheckboxGroup
              title="Kitchen Features"
              :options="kitchenFeaturesOptions"
              :model-value="getSelectedKitchenFeatures(kitchen)"
              :name="`kitchen-${index}-features`"
              @update:modelValue="updateKitchenFeatures(kitchen, $event)"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Select all features that apply to the kitchen. These help showcase functionality and style to potential buyers or renters.'
                ]" />
              </template>
            </OrganismsDraftFormCheckboxGroup>

            <OrganismsDraftFormSizeToggle
              title="Kitchen Size"
              :options="sizeOptions"
              :unit="'meter'"
              :size="kitchen.size"
              :name="`kitchen-${index}-size`"
              @update:unit="() => {}"
              @update:size="(value: number | null) => (kitchen.size = value)"
            >
              <template #tooltip-content>
                <AtomsTooltipParagraphs :paragraphs="[
                  'Enter the kitchen\'s floor area (either in square meters, or square foot). If you\'re unsure how to measure the floor area, please visit our guides.'
                ]" />
              </template>
            </OrganismsDraftFormSizeToggle>

            <div class="o-kitchen-form__form-actions">
              <button
                type="button"
                @click="saveRoom(index)"
                class="button button-sm button-secondary | body-sm"
                :disabled="!isRoomCompleted(kitchen) || !hasRoomChanges(index)"
              >
                {{ lastAddedRoomIndex === index ? 'Save Kitchen' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelRoom(index)"
                class="button button-sm button-tertiary | body-sm"
              >
                {{ lastAddedRoomIndex === index ? 'Cancel' : 'Cancel Changes' }}
              </button>
            </div>

            <AtomsDivider v-if="index < localKitchens.length - 1" />
          </div>
        </Transition>
      </div>
    </div>

    <div class="o-kitchen-form__add-item" v-show="!hasOpenRoomForm">
      <button
        type="button"
        @click="addRoom"
        class="button button-sm button-secondary | body-sm"
        :disabled="hasAnyRooms && addButtonDisabled"
      >
        {{ hasAnyRooms ? '+ Add Another Kitchen' : '+ Add Kitchen' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Kitchen } from '~~/layers/database/server/database/prisma/generated/client';

import { kitchenFeaturesOptions } from "../../../utils/draft/step-six";

interface Props {
  modelValue: Omit<Kitchen, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

const floorOptions = computed(() => getFloorOptions(props.totalFloors));

const localKitchens = computed(() => props.modelValue);

const roomManagerConfig = {
  isRoomCompleted: (kitchen: any) =>
    Boolean(kitchen.name && kitchen.roomNumber && kitchen.floor !== null && kitchen.floor !== undefined),
  createNewRoom: (roomNumber: number) => ({
    name: null,
    roomNumber,
    floor: 1,
    description: '',
    size: null,
    modern: true,
    openPlan: false,
    whiteGoods: false,
    breakfastBar: false,
    island: false,
    utilityAccess: false,
    pantry: true,
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
} = useRoomManager(localKitchens, emit, roomManagerConfig);

onMounted(() => {
  initializeRoomManager();
});

function getSelectedKitchenFeatures(kitchen: any): string[] {
  const features: string[] = [];

  kitchenFeaturesOptions.forEach((option: { value: string }) => {
    if (kitchen[option.value]) {
      features.push(option.value);
    }
  });

  return features;
}

function updateKitchenFeatures(kitchen: any, selectedFeatures: string[]) {
  kitchenFeaturesOptions.forEach((option: { value: string }) => {
    kitchen[option.value] = false;
  });

  selectedFeatures.forEach((feature) => {
    kitchen[feature] = true;
  });
}
</script>

<style lang="scss">
.o-kitchen-form {
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
    gap: var(--size-12);
    margin-top: var(--size-24);
    margin-bottom: var(--size-24);
  }

  &__add-item {
    display: flex;
    justify-content: center;
  }
}
</style>
