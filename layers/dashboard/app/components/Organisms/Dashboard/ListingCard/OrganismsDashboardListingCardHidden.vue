<template>
  <div class="relative h-full">
    <UPageCard
      variant="naked"
      reverse
      class="p-4 border border-accented/50 bg-elevated/30 rounded-lg h-full flex flex-col transition-all duration-300"
      :class="{
        'opacity-40 blur-xs pointer-events-none': pendingUnhide,
      }"
      :ui="{
        header: 'mb-0 w-full',
        title: 'my-1',
        description: 'text-(--foreground-100) w-full flex-1 flex flex-col justify-between',
        footer: 'mt-1 pt-0 w-full',
        body: 'w-full flex flex-col flex-1',
      }"
    >
      <AtomsCloudFlareImage v-if="getMainImage(listing?.property)" :src="getMainImage(listing?.property)!" alt="Listing image" variant="gallery" :placeholder="true" class="w-full h-54 object-bottom object-cover rounded-lg aspect-4/3" />

      <template #header>
        <div class="flex flex-row justify-between">
          <div class="flex justify-between items-start">
            <p class="body-sm">
              <span class="font-bold body-md">
                {{ formatCurrency(listing.price) }}
              </span>
              / {{ convertEnumToCapalizedString(listing.saleListing?.priceType || listing.rentalListing?.rentFrequency || "") }}
            </p>
          </div>
          <UBadge size="md" color="secondary" class="mx-1" variant="subtle">
            {{ listing.rentalListing ? "For Rent" : "For Sale" }}
          </UBadge>
        </div>
      </template>

      <template #title>
        <p class="body-sm">{{ formattedAddress(listing?.property?.address) }}</p>
      </template>

      <template #description>
        <div class="flex flex-row flex-wrap gap-1">
          <UBadge icon="i-lucide-bed-double" size="md" color="secondary" variant="subtle"> {{ listing?.property?.numberBedrooms }} bed </UBadge>
          <UBadge icon="i-lucide-bath" size="md" color="secondary" variant="subtle"> {{ listing?.property?.numberBathrooms }} bathroom </UBadge>
          <UBadge v-if="listing?.property?.outdoorSpace?.garden.length" icon="i-lucide-fence" size="md" color="secondary" variant="subtle"> {{ listing?.property?.outdoorSpace?.garden.length }} garden </UBadge>
        </div>

        <div v-if="reason" class="my-4 text-muted-foreground flex items-start gap-1">
          <UIcon name="i-lucide-message-square" class="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span class="leading-snug line-clamp-2 body-sm">{{ reason }}</span>
        </div>
        <div v-else class="my-2" />

        <div class="grid grid-cols-1 gap-2 items-center">
          <UButton variant="solid" size="md" color="secondary" block class="text-white! font-bold" :to="`/listing/${listing?.id}`" target="_blank"> View </UButton>
        </div>
      </template>

      <template #footer>
        <USeparator class="my-3" />
        <div class="flex justify-between items-center w-full">
          <p v-if="hiddenAt" class="body-xs">
            Hidden on:
            {{
              new Date(hiddenAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            }}
          </p>
          <div class="flex gap-2 items-center ml-auto">
            <UButton
              variant="subtle"
              size="xs"
              color="secondary"
              icon="i-lucide-eye"
              :disabled="pendingUnhide"
              class="body-sm cursor-pointer"
              @click="handleUnhide"
            >
              {{ pendingUnhide ? 'Unhiding...' : 'Unhide' }}
            </UButton>
          </div>
        </div>
      </template>
    </UPageCard>
  </div>
</template>
<script lang="ts" setup>
const { unhideListing } = useHiddenListings();

interface Props {
  listing: ListingCardType;
  hiddenAt?: string | Date;
  reason?: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits<{ unhide: [listingId: number] }>();

// Local pending state — only true after the user explicitly clicks Unhide
const pendingUnhide = ref(false);

async function handleUnhide() {
  pendingUnhide.value = true;
  try {
    await unhideListing(props.listing?.id!);
    emit('unhide', props.listing?.id!);
  } catch {
    pendingUnhide.value = false;
  }
}

/**
 * Format Address
 */
const formattedAddress = (address: any): string => {
  if (!address) return "";
  return address.street + ", " + address.city + ", " + address.postcode.split(" ")[0];
};
</script>
