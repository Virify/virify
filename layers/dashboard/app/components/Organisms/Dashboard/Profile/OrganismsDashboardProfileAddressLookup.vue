<template>
  <UFormField label="Address" name="address" required orientation="horizontal" description="This will not be publicly displayed" :error="addressError" help="Enter your postcode">
    <template #error="{ error }">
      <p>{{ error }}</p>
    </template>
    <div class="w-full md:w-80">
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
        <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="clearAddress" />
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
          :ui="{
            base: 'w-full! md:w-80!',
          }"
        />
      </div>
    </div>
  </UFormField>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: AddressParsed | null;
  pending?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: AddressParsed | null): void;
}>();

const postcode = ref("");
const lookupPending = ref(false);
const foundAddresses = ref<{ label: string; value: string }[]>([]);
const rawAddresses = ref<any[]>([]);
const selectedAddress = ref("");
const addressError = ref<string | undefined>(undefined);

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
      const parsed = parseAddress(selectedRaw, postcode.value);
      emit("update:modelValue", parsed);
    }
  }
};
</script>
