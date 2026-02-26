<template>
  <UFormField 
    label="Address" 
    name="address" 
    required 
    :orientation="variant === 'listing' ? 'vertical' : 'horizontal'" 
    :description="variant === 'listing' ? 'Enter your postcode to find your property address' : 'This will not be publicly displayed'" 
    :error="addressError" 
    :help="variant === 'listing' ? undefined : 'Enter your postcode'" 
    :ui="formFieldUi"
  >
    <template #error="{ error }">
      <p>{{ error }}</p>
    </template>
    <div :class="containerClass">
      <div v-if="modelValue && modelValue.fullAddress" key="address-found" class="flex gap-2 w-full items-center">
        <UInput
          :model-value="modelValue.fullAddress"
          type="text"
          variant="subtle"
          :loading="pending"
          color="secondary"
          class="grow"
          disabled
          :ui="{
            base: 'placeholder:text-(--foreground-200)/50!',
          }"
        />
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="clearAddress" />
      </div>
      <div v-else key="address-lookup" class="w-full flex flex-col gap-2">
        <div class="flex gap-2">
          <UInput
            v-model="postcode"
            placeholder="Enter Postcode"
            class="grow body-sm"
            variant="subtle"
            color="secondary"
            @keydown.enter.prevent="lookupPostcode"
            :ui="{
              base: 'placeholder:text-(--foreground-200)/50!',
            }"
          />
          <UButton
            label="Find"
            @click="lookupPostcode"
            :loading="lookupPending"
            color="secondary"
            variant="solid"
            :ui="{
              label: 'text-white',
            }"
          />
        </div>
        <USelect
          v-if="foundAddresses.length > 0"
          v-model="selectedAddress"
          :items="foundAddresses"
          placeholder="Select Address"
          variant="subtle"
          color="secondary"
          @update:model-value="onAddressSelect"
          class="w-full"
          :ui="selectUi"
        />
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: AddressParsed | null;
  pending?: boolean;
  variant?: 'profile' | 'listing';
}>(), {
  variant: 'profile',
});

const emit = defineEmits<{
  (e: "update:modelValue", value: AddressParsed | null): void;
}>();

// Computed styles based on variant
const formFieldUi = computed(() => {
  if (props.variant === 'listing') {
    return {
      root: 'flex flex-col gap-1',
      error: 'body-xs',
      description: 'body-xs text-(--foreground-200)/60',
    }
  }
  return {
    root: 'flex flex-col md:flex-row md:flex-wrap items-stretch md:items-start gap-2 md:gap-0',
    error: 'w-full md:w-80 body-xs',
    help: 'body-xs text-(--foreground-200)/60 self-center mt-1',
  }
})

const containerClass = computed(() => {
  return props.variant === 'listing' ? 'w-full max-w-md' : 'w-full md:w-80'
})

const selectUi = computed(() => {
  if (props.variant === 'listing') {
    return {
      base: 'w-full!',
      content: 'max-h-60 overflow-y-auto',
    }
  }
  return {
    base: 'w-full! md:w-80!',
  }
})

const postcode = ref("");
const lookupPending = ref(false);
const foundAddresses = ref<{ label: string; value: string }[]>([]);
const rawAddresses = ref<any[]>([]);
const selectedAddress = ref("");
const addressError = ref<string | undefined>(undefined);
// Store lat/lon from response level (getaddress.io returns these at top level, not per-address)
const responseLat = ref<number | null>(null);
const responseLon = ref<number | null>(null);

const clearAddress = () => {
  emit("update:modelValue", {
    number: null,
    flat: null,
    name: null,
    street: null,
    city: null,
    locality: null,
    county: null,
    district: null,
    country: null,
    postcode: null,
    fullAddress: null,
    lat: null,
    lon: null,
  });
  postcode.value = "";
  foundAddresses.value = [];
  rawAddresses.value = [];
  selectedAddress.value = "";
  addressError.value = undefined;
  responseLat.value = null;
  responseLon.value = null;
};

const lookupPostcode = async () => {
  addressError.value = undefined;
  if (!postcode.value) {
    addressError.value = "Please enter a postcode";
    return;
  }

  const config = useRuntimeConfig();
  const apiKey = config.public.GETADDRESS_IO_API_KEY;
  if (!apiKey) {
    addressError.value = "Address lookup service not configured";
    return;
  }

  lookupPending.value = true;
  try {
    const data: any = await $fetch(`https://api.getaddress.io/find/${postcode.value}?api-key=${apiKey}&expand=true`);

    if (data && data.addresses && data.addresses.length > 0) {
       console.log(data)
      // Store lat/lon from response level (getaddress.io returns these at top level)
      responseLat.value = data.latitude ?? null;
      responseLon.value = data.longitude ?? null;
      rawAddresses.value = data.addresses;
      foundAddresses.value = data.addresses.map((addr: any) => {
        const fullString = addr.formatted_address.filter((s: string) => s).join(", ");
        const label = `${fullString}, ${postcode.value.toUpperCase()}`;
        return { label, value: label };
      });
    } else {
      addressError.value = "No addresses found for this postcode";
    }
  } catch (error) {
    addressError.value = "Failed to find address. Please check the postcode and try again.";
  } finally {
    lookupPending.value = false;
  }
};

const onAddressSelect = (value: string) => {
  if (value) {
    const selectedRaw = rawAddresses.value.find((addr: any) => {
      const fullString = addr.formatted_address.filter((s: string) => s).join(", ");
      const label = `${fullString}, ${postcode.value.toUpperCase()}`;
      return label === value;
    });

    if (selectedRaw) {
      // Inject lat/lon from response level before parsing
      const addressWithCoords = {
        ...selectedRaw,
        latitude: responseLat.value,
        longitude: responseLon.value,
      };
      const parsed = parseAddress(addressWithCoords, postcode.value);
      emit("update:modelValue", parsed);
    }
  }
};
</script>
