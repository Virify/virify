<template>
  <div class="o-bedroom-form">
    <div class="o-bedroom-form__items">
      <div 
        v-for="(bedroom, index) in localBedrooms" 
        :key="index"
        class="o-bedroom-form__item"
      >
        <div class="o-bedroom-form__item-header">
          <h4 class="o-bedroom-form__item-title | body-md font-semibold">Bedroom {{ index + 1 }}</h4>
          <button
            v-if="localBedrooms.length > 1"
            type="button"
            @click="removeBedroom(index)"
            class="button button-sm button-delete | body-xs"
          >
            Remove
          </button>
        </div>
        
        <div class="o-bedroom-form__form-grid">
          <!-- Bedroom Name -->
          <OrganismsDraftFormTextGroup
            title="Bedroom Name"
            v-model="bedroom.name"
            :name="`bedroom-${index}-name`"
            placeholder="e.g. Master Bedroom, Guest Room"
            :required="true"
            :grid="true" 
          />

          <!-- Bedroom Description -->
          <OrganismsDraftFormTextGroup
            title="Bedroom Description"
            v-model="bedroom.description"
            :name="`bedroom-${index}-description`"
            placeholder="Describe this bedroom..."
            :grid="true"
            :expanded="true" 
          />

          <!-- Bedroom Number -->
          <OrganismsDraftFormNumberGroup
            title="Bedroom Number"
            v-model="bedroom.roomNumber"
            :name="`bedroom-${index}-number`"
            placeholder="1"
            :required="true"
            :grid="true"
            min="1"
            step="1"
          />

          <!-- Floor -->
          <OrganismsDraftFormSelectGroup
            title="Floor"
            :options="floorOptions"
            v-model="bedroom.floor"
            :name="`bedroom-${index}-floor`"
            :required="true"
            :grid="true"
          />
        </div>

        <!-- Bed Size -->
        <OrganismsDraftFormRadioGroup
          title="Bed Size"
          :options="bedSizeOptions"
          v-model="bedroom.bed[0]"
          :name="`bedroom-${index}-bed`"
          :required="true"
        />

        <!-- Bedroom Features (Multi-select) -->
        <OrganismsDraftFormCheckboxGroup
          title="Bedroom Features"
          :options="bedroomFeaturesOptions"
          :model-value="getSelectedBedroomFeatures(bedroom)"
          :name="`bedroom-${index}-features`"
          @update:modelValue="updateBedroomFeatures(bedroom, $event)"
        />

        <!-- Bedroom Size -->
        <OrganismsDraftFormSizeToggle
          title="Bedroom Size"
          :options="sizeOptions"
          :unit="'meter'"
          :size="bedroom.size"
          :name="`bedroom-${index}-size`"
          @update:unit="() => {}"
          @update:size="(value: number | null) => bedroom.size = value"
        />
      </div>
    </div>

    <!-- Add Bedroom Button -->
    <div class="o-bedroom-form__add-item">
      <button
        type="button"
        @click="addBedroom"
        class="button button-sm button-secondary | body-sm"
      >
        + Add Another Bedroom
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: any[];
  totalFloors: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any[]];
}>();

// Computed floor options based on totalFloors
const floorOptions = computed(() => getFloorOptions(props.totalFloors));

// Ensure there's always at least one bedroom
const localBedrooms = computed(() => {
  if (props.modelValue.length === 0) {
    // Initialize with one bedroom if none exist
    const initialBedroom = {
      name: null,
      roomNumber: 1,
      floor: 0,
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
    };
    
    // Emit the initial bedroom to parent
    nextTick(() => {
      emit('update:modelValue', [initialBedroom]);
    });
    
    return [initialBedroom];
  }
  
  return props.modelValue;
});

// Methods
function addBedroom() {
  const currentBedrooms = localBedrooms.value;
  const newBedroom = {
    name: null,
    roomNumber: currentBedrooms.length + 1,
    floor: 0,
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
  };
  
  const updatedBedrooms = [...currentBedrooms, newBedroom];
  emit('update:modelValue', updatedBedrooms);
}

function removeBedroom(index: number) {
  const currentBedrooms = localBedrooms.value;
  const updatedBedrooms = currentBedrooms.filter((_, i) => i !== index);
  
  // Update bedroom numbers
  updatedBedrooms.forEach((bedroom, i) => {
    bedroom.roomNumber = i + 1;
  });
  
  emit('update:modelValue', updatedBedrooms);
}

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

<style lang="scss">
.o-bedroom-form {
  &__items {
    display: flex;
    flex-direction: column;
    gap: var(--size-48);
  }
  
  &__item {
    padding: var(--size-16) 0;
    border: 1px solid var(--border-200);
    border-radius: var(--radius-lg);
    background: var(--background-50);
  }
  
  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-24);
    padding-bottom: var(--size-16);
    border-bottom: 1px solid var(--border-100);
  }
  
  &__item-title {
    color: var(--text-900);
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
  
  &__add-item {
    display: flex;
    justify-content: center;
    margin-top: var(--size-32);
  }
}
</style>