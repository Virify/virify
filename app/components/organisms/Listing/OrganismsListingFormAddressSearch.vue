<template>
  <div class="address-search">
    <MoleculesListingFormHeading 
      title="Enter your address or postcode." 
      :required="true" 
      :tooltip="tooltip" 
      :hasTooltip="!!tooltip || !!$slots['tooltip-content']"
    >
      <template #tooltip-content>
        <slot name="tooltip-content">
          <p class="body-xs">{{ tooltip }}</p>
        </slot>
      </template>
    </MoleculesListingFormHeading>
    
    <div class="address-search__input-wrapper">
      <!-- Single input with getaddress.io autocomplete -->
      <AtomsInput
        ref="addressInput"
        id="getaddress-autocomplete"
        name="address-search"
        placeholder="Start typing your address..."
        required
        class="address-search__input | body-sm"
        autocomplete="street-address"
        v-model="query"
      />
      
      <!-- Error message -->
      <div v-if="error" class="address-search__error">
        <span class="body-xs">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as getAddress from '@getaddress/autocomplete';

interface Props {
  tooltip?: string;
}

interface Emits {
  'address-selected': [address: AddressParsed];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const addressInput = ref();
const error = ref<string | null>(null);
const isInitialized = ref(false);
const query = ref('');

// Initialize autocomplete
const initializeAutocomplete = async () => {
  if (isInitialized.value) return;
  
  try {
    const config = useRuntimeConfig();
    const apiKey = config.public.GETADDRESS_IO_API_KEY;
    
    if (!apiKey) {
      error.value = 'API key not configured';
      return;
    }

    // Ensure the input element exists
    const inputElement = document.getElementById('getaddress-autocomplete');
    if (!inputElement) {
      error.value = 'Address input not found';
      return;
    }

    // Try different ways to call the autocomplete function
    const autocompleteFn = (getAddress as any).autocomplete || (getAddress as any).default?.autocomplete || getAddress;
    
    await autocompleteFn('getaddress-autocomplete', apiKey, {
      delay: 200,
      minimum_characters: 4,
      suggestion_count: 6,
      show_postcode: true,
      enable_history: false,
      full_length:true,
      mobile_friendly: true,
      selected: (address: any) => {
        console.log('Address selected:', address);
        // Parse the address from getaddress.io format
        const parsedAddress = parseAddress(address, address.postcode);
        
        // Reflect the selected address in the input
        if (parsedAddress.fullAddress) {
          query.value = parsedAddress.fullAddress;
        }
        
        emit('address-selected', parsedAddress);
      },
      suggested: (suggestions: any[]) => {
        console.log('Suggestions:', suggestions);
        error.value = null;
      },
      selected_failed: (status: number, message: string) => {
        console.error('Address selection failed:', status, message);
        error.value = message || 'Failed to select address';
      },
      suggested_failed: (status: number, message: string) => {
        console.error('Address suggestions failed:', status, message);
        error.value = message || 'Failed to get address suggestions';
      }
    });
    
    isInitialized.value = true;
    
  } catch (err) {
    console.error('Failed to initialize address autocomplete:', err);
    error.value = 'Failed to initialize address search';
  }
};

onMounted(() => {
  nextTick(() => {
    initializeAutocomplete();
  });
});

onUnmounted(() => {
  // Clean up autocomplete
  const inputElement = document.getElementById('getaddress-autocomplete');
  if (inputElement) {
    // Remove any event listeners or cleanup
    inputElement.removeAttribute('data-getaddress-autocomplete');
  }
  isInitialized.value = false;
});
</script>

<style lang="scss">
.address-search {
  position: relative;
  padding: var(--size-32) 0;

  &__title {
    text-align: center;
    padding-bottom: var(--size-16);
  }

  &__required {
    color: var(--error);
    margin-left: var(--size-4);
  }

  &__input-wrapper {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
  }

  &__input {
    width: 100%;
  }

  &__error {
    padding: var(--size-8) 0;
    text-align: center;
    color: var(--error);
  }

  & {
    --ga-autocomplete-list-max-height: 20em;
    --ga-autocomplete-list-font-size: var(--font-sm);
    --ga-autocomplete-list-background-color: var(--background-200);
  } 
}

</style>