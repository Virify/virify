<template>
  <UPageCard
    variant="naked"
    reverse
    class="p-4 border border-accented/50 bg-elevated/50 rounded-lg h-full flex flex-col"
    :ui="{
      header: 'mb-0',
      title: 'my-1',
      description: 'my-2 text-(--foreground-100) w-full flex-1 flex flex-col',
      footer: 'mt-1 pt-0 w-full',
      body: 'w-full flex flex-col flex-1',
    }"
  >
  <AtomsCloudFlareImage
    v-if="listing?.property?.media[0]"
    :src="listing?.property?.media[0]?.image!"
    alt="Listing image"
    variant="gallery"
    :placeholder="true"
    class="w-full h-64 object-bottom object-cover rounded-lg aspect-4/3"
    />

    <template #header>
      <div class="flex justify-between items-start">
        <p class="body-sm">
          <span class="font-bold body-md">
            {{ formattedPrice(listing) }}
          </span>
            / {{ convertEnumToCapalizedString(listing.saleListing?.priceType!) }}
        </p>
      </div>
    </template>

    <template #title>
      <p class="body-sm font-semibold">{{ formattedAddress(listing?.property?.address) }}</p>
    </template>

    <template #description>
      <div class="flex flex-row flex-wrap gap-2">
        <UBadge icon="i-lucide-bed-double" size="md" color="secondary">
        {{ listing?.property?.numberBedrooms }} bed
        </UBadge>
        <UBadge icon="i-lucide-bath" size="md" color="secondary">
          {{ listing?.property?.numberBathrooms }} bathroom
        </UBadge>
        <UBadge v-if="listing?.property?.outdoorSpace?.garden.length" icon="i-lucide-fence" size="md" color="secondary">
          {{ listing?.property?.outdoorSpace?.garden.length }} garden
        </UBadge>
      </div>
      <div class="mt-4 border border-accented/50 bg-elevated w-full rounded-lg p-2 cursor-pointer">
        <p class="body-xs" @click="showNoteDialog(listing?.id!)">Note: {{ getNote(listing?.id!) || 'Click to add note!' }}</p>
      </div>
      
    </template>

    <template #footer>
      <USeparator class="mb-4" />
      <div class="flex justify-between w-full">
        <UBadge size="md" color="secondary" class="mx-1">
          {{ listing.rentalListing ? 'For Rent' : 'For Sale' }}
        </UBadge>
        <div class="flex gap-2">
          <AtomsNoteButton
            :listing-id="listing?.id!"
          />
          <AtomsFavouriteButton
            :is-favourite="true"
            :listing-id="listing?.id!"
            @remove="removeFromFavourite(listing?.id!)"
          />
        </div>
      </div>
    </template>
  </UPageCard>
</template>
<script lang="ts" setup>
const  {removeFromFavourite } = useFavourites()
const { getNote, showNoteDialog } = useNotes()

interface Props {
  listing: any
}

defineProps<Props>()

function formattedPrice(listing: any): string {
  if (!listing || !listing.price) {
    return 'Price not available';
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(listing.price);
}

/** omit street number */
const formattedAddress = (address: any): string => {
  if (!address) return '';
  /** omit street number */
  return address.street + ", " + address.city + ", " + address.postcode.split(" ")[0]
};
</script>