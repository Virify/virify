<template>
  <div class="v-ownership | flow dialog-container dialog-container-lg dialog-overflow-visible">
    <h1 class="v-ownership__title | title-xl">Verify your property ownership</h1>
    <p class="v-ownership__description | body-sm">
      To create your listing, we need to verify you own this property. Please select your property address and upload <strong>two documents</strong> from the following:
    </p>

    <ul class="v-ownership__list | body-sm">
      <li>Property deeds or title documents</li>
      <li>Mortgage statement</li>
      <li>Sales contract</li>
    </ul>

    <p class="v-ownership__description | body-sm">
      <strong>Important:</strong> Documents must clearly show your name and the property address. We accept JPG, PNG, and PDF files.
    </p>

    <MoleculesForm @submit.prevent="submitForm">
      <OrganismsListingFormAddressSearch @address-selected="handleAddressSelected" />

      <div class="v-ownership__dropzone" @click="handleFile(fileInput)">
        <p v-if="!selectedFile" class="body-sm">Click here to upload your document</p>
        <div v-if="selectedFile" class="v-ownership__dropzone--file | body-sm">
          <p>Selected: {{ selectedFile.name }} — {{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
          <button class="button button-sm button-delete" @click.stop="selectedFile = null">Remove</button>
        </div>

        <input ref="fileInput" type="file" accept="image/*,.pdf" hidden @change="onFileChange" />
      </div>

      <div class="v-ownership__actions">
        <button type="submit" class="button button-sm button-tertiary">Submit</button>
      </div>
    </MoleculesForm>
  </div>
</template>

<script setup lang="ts">
import type { AddressCreateWithoutUserInput } from '~~/layers/database/server/database/prisma/generated/models';

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

defineProps({
  successMessage: {
    type: String,
    default: "",
  },
  fromProtectedPage: {
    type: Boolean,
    default: false,
  },
})

const { fetch } = useUserSession();
const { hideDialog } = useDialog();

const hasSelectedAddress = ref(false);
const address = ref<AddressCreateWithoutUserInput>({
  number: null,
  flat: null,
  name: null,
  locality: null,
  district: null,
  street: '',
  city: '',
  county: null,
  postcode: '',
  country: null,
  fullAddress: null,
  lat: null,
  lon: null,
}
);

function handleAddressSelected(selectedAddress: any) {
  console.log('Address selected for ownership verification:', selectedAddress);
  hasSelectedAddress.value = true;
  address.value = {
    number: selectedAddress.number,
    flat: selectedAddress.flat,
    name: selectedAddress.name,
    street: selectedAddress.street,
    city: selectedAddress.city,
    locality: selectedAddress.locality,
    district: selectedAddress.district,
    county: selectedAddress.county,
    country: selectedAddress.country,
    postcode: selectedAddress.postcode,
    fullAddress: selectedAddress.fullAddress,
    lat: selectedAddress.lat,
    lon: selectedAddress.lon,
  };
}

function handleFile(input: HTMLInputElement | null) {
  input?.click();
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]!;
  }
}

function validateAddress() {
  return Boolean(
    address.value.number &&
    address.value.street &&
    address.value.city &&
    address.value.postcode &&
    address.value.lat &&
    address.value.lon
  );
}

async function submitForm() {
  const formData = new FormData();
  if(!validateAddress()) return;
  formData.append('address', JSON.stringify(address.value));
  formData.append('file', selectedFile.value!);
  
  const response = await $fetch('/api/verification/', {
    method: 'POST',
    body: formData
  })
}
</script>
<style lang="scss">
.v-ownership {
  &__title {
    margin-bottom: var(--size-12);
  }

  &__description {
    margin-bottom: var(--size-12);
  }

  &__list {
    margin-bottom: var(--size-12);
    padding-left: var(--size-24);
    
    li {
      margin-bottom: var(--size-4);
    }
  }

  &__form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-12);
  }

  &__dropzone {
    margin-top: var(--size-16);
    margin-bottom: var(--size-16);
    padding: var(--size-24);
    border: 2px dashed var(--tertiary-200);
    border-radius: var(--size-8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;

    &--file {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: var(--size-12);
    }
  }

  &__actions {
    margin-top: var(--size-12);
    display: flex;
    justify-content: flex-end;
  }
}

.dialog-overflow-visible {
  overflow: visible;
}
</style>
