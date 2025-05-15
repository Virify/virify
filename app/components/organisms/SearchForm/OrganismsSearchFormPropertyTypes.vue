<template>
  <div>
    <!-- Property types selection -->
    <OrganismsSearchFormTitleBlock title="Property type">
      <MoleculesScrollBox class="| focus-overflow">
        <ul class="o-searchform-property-types">
          <li v-for="({ id, name, selected }, index) in selectedPropertyTypes" :key="id">
            <AtomsToggleBox :label="name" :checked="selected" type="checkbox" :name="name"
              @change="togglePropertyType(index)" />
          </li>
        </ul>
      </MoleculesScrollBox>
    </OrganismsSearchFormTitleBlock>

    <!-- Classifications section (hidden when all types selected) -->
    <template v-if="!allDefaultsSelected">

      <!-- Classification options -->
      <template v-if="shouldShowClassifications">
        <AtomsDivider />

        <div v-for="propertyType in selectedPropertyTypesWithClassifications" :key="propertyType.id"
          class="o-property-type-classification">
          <animate-in :delay="75">
            <OrganismsSearchFormTitleBlock :title="`${propertyType.name} Type`">
              <MoleculesScrollBox class="| focus-overflow">
                <ul class="o-searchform-property-types">
                  <li
                    v-for="classification in propertyClassifications.filter(c => c.propertyTypeId === propertyType.id)"
                    :key="classification.id">
                    <AtomsToggleBox :label="classification.name" :checked="classification.selected" type="checkbox"
                      :name="`property-classification-${classification.id}`"
                      @change="togglePropertyClassification(propertyClassifications.findIndex(c => c.id === classification.id))" />
                  </li>
                </ul>
              </MoleculesScrollBox>
            </OrganismsSearchFormTitleBlock>
          </animate-in>
        </div>
      </template>

      <!-- Show more options button -->
      <div v-if="selectedPropertyTypesWithClassifications.length > 0" role="presentation"
        class="o-property-type-button">
        <AtomsButton type="button" class="o-searchform-expand o-searchform-buttons | button-bordered button-full"
          @click.prevent="toggleClassificationPopoverExpanded">
          {{ classificationPopoverExpanded ? "Show fewer options" : "Show more property options" }}
        </AtomsButton>
      </div>
    </template>

    <AtomsDivider />
  </div>
</template>

<script setup lang="ts">
import type { PropertyTypeWithClassifications } from "~~/shared/types/property-type";

type PropertyTypeWithSelected = PropertyTypeWithClassifications & { selected: boolean };
type PropertyClassification = {
  id: number;
  name: string;
  selected: boolean;
  propertyTypeId: number;
  propertyTypeName: string
};

const props = defineProps<{
  propertyTypes: PropertyTypeWithClassifications[];
  modelValue?: PropertyTypeWithSelected[];
  propertyClassificationsValue?: PropertyClassification[];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: PropertyTypeWithSelected[]): void;
  (e: 'update:propertyClassificationsValue', value: PropertyClassification[]): void;
}>();

// State
const classificationPopoverExpanded = ref(false);

// Initialize property types with selected state
const specificPropertyTypes = ref(
  props.modelValue || props.propertyTypes.map(pt => ({ ...pt, selected: false }))
);

// Initialize property classifications array
const propertyClassifications = ref<PropertyClassification[]>(
  props.propertyClassificationsValue?.length
    ? [...props.propertyClassificationsValue]
    : []
);

// Core computed properties
const allDefaultsSelected = computed(() =>
  specificPropertyTypes.value.every(pt => pt.selected)
);

const selectedPropertyTypes = computed(() => [...specificPropertyTypes.value]);

const selectedPropertyTypesWithClassifications = computed(() =>
  specificPropertyTypes.value.filter(pt =>
    pt.selected && pt.classifications?.length > 0
  )
);

const shouldShowClassifications = computed(() =>
  selectedPropertyTypesWithClassifications.value.length > 0 &&
  classificationPopoverExpanded.value
);

// Handle property type toggle
function togglePropertyType(index: number) {
  const type = specificPropertyTypes.value[index];
  if (!type) return;

  // Toggle selection
  type.selected = !type.selected;

  // Reset classifications popover if all types selected
  if (allDefaultsSelected.value) {
    classificationPopoverExpanded.value = false;
  }

  // Update classifications and emit changes
  updatePropertyClassifications();
  emits('update:modelValue', specificPropertyTypes.value);
}

// Toggle classification popover visibility
function toggleClassificationPopoverExpanded() {
  classificationPopoverExpanded.value = !classificationPopoverExpanded.value;
}

// Update property classifications when types change
function updatePropertyClassifications() {
  // Clear all if all types selected
  if (allDefaultsSelected.value) {
    propertyClassifications.value = [];
    emits('update:propertyClassificationsValue', []);
    return;
  }

  // Save existing selections to preserve state
  const existingClassifications = [...propertyClassifications.value];
  propertyClassifications.value = [];

  // Rebuild classifications for selected types
  selectedPropertyTypesWithClassifications.value.forEach(propertyType => {
    const typeClassifications = propertyType.classifications.map(c => {
      // Preserve previous selection state when available
      const existing = existingClassifications.find(
        ec => ec.id === c.id && ec.propertyTypeId === propertyType.id
      );

      return {
        ...c,
        selected: existing ? existing.selected : true,
        propertyTypeId: propertyType.id,
        propertyTypeName: propertyType.name,
      };
    });

    propertyClassifications.value.push(...typeClassifications);
  });

  emits('update:propertyClassificationsValue', propertyClassifications.value);
}

// Toggle classification selection
function togglePropertyClassification(index: number) {
  const classification = propertyClassifications.value[index];
  if (!classification) return;

  classification.selected = !classification.selected;
  emits('update:propertyClassificationsValue', propertyClassifications.value);
}

// Initialize on mount
onMounted(() => {
  if (!props.propertyClassificationsValue?.length) {
    updatePropertyClassifications();
  }
});
</script>
<style lang="scss">
.o-property-type-classification {
  margin-bottom: var(--size-16);
}

.o-property-type-button {
  margin-top: var(--size-16);
}
</style>