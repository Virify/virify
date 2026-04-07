<template>
  <UFormField 
    label="Address" 
    name="address" 
    :required="variant === 'listing'" 
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
const selectedAddress = ref<string | undefined>(undefined);
const addressError = ref<string | undefined>(undefined);
const postcodeCache = new Map<string, any[]>();

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
  selectedAddress.value = undefined;
  addressError.value = undefined;
};

const setAddressResults = (data: any[]) => {
  rawAddresses.value = data;
  foundAddresses.value = data.map((addr: any) => ({
    label: capataliseWords(addr.envelopeAddress.summaryLine) ?? addr.envelopeAddress.summaryLine,
    value: addr.envelopeAddress.summaryLine,
  }));
};

const lookupPostcode = async () => {
  addressError.value = undefined;
  const normalised = postcode.value.trim().toUpperCase();
  if (!normalised) {
    addressError.value = "Please enter a postcode";
    return;
  }

  const cached = postcodeCache.get(normalised);
  if (cached) {
    setAddressResults(cached);
    return;
  }

  const config = useRuntimeConfig();
  const apiKey = config.public.EASYPOSTCODES_KEY as string;
  if (!apiKey) {
    addressError.value = "Address lookup service not configured";
    return;
  }

  lookupPending.value = true;
  try {
    const data: any = await $fetch(`https://api.easypostcodes.com/addresses/${normalised}?includeGeo=true`, {
      headers: { 'Key': apiKey },
    });

    if (data && data.length > 0) {
      postcodeCache.set(normalised, data);
      setAddressResults(data);
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
  const selectedRaw = rawAddresses.value.find((addr: any) => addr.envelopeAddress?.summaryLine === value);
  if (selectedRaw) {
    const parsed = parseAddress(selectedRaw, postcode.value);
    emit("update:modelValue", parsed);
  }
};
</script>
