<template>
  <NuxtLink
    v-if="listing"
    :to="`/listing/${listing.id}`"
    target="_blank"
    class="flex gap-3 p-3 h-auto w-full rounded-lg bg-background-200 hover:bg-elevated/60 transition-colors cursor-pointer group"
    @click.stop
  >
    <div v-if="getMainImage(listing.property)" class="w-16 h-full overflow-hidden shrink-0">
      <AtomsCloudFlareImage :src="getMainImage(listing.property)!"
        :alt="listing.property?.address?.fullAddress || 'Property'"
        class="w-full h-full object-cover aspect-4/3 rounded-md" variant="thumbnail" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2 mb-0">
        <p class="text-base font-bold text-secondary leading-none flex items-center gap-1">
          {{ formatCurrency((listing.price)) }}
          <AtomsPriceHistoryPopover
            v-if="listing.ListingPriceHistory?.length"
            :price-history="listing.ListingPriceHistory"
            :current-price="listing.price"
          />
        </p>
        <div class="flex items-center gap-1.5">
          <UBadge :label="listing.rentalListing ? 'To Rent' : 'For Sale'" color="secondary" variant="soft" size="md" />
          <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <p class="text-xs font-medium text-foreground mb-2">
        {{ listing.property?.type?.name || 'Property Type N/A' }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
        {{ listing.property?.address?.fullAddress || 'Address not available' }}
      </p>
      <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
        <span v-if="listing.property?.numberBedrooms" class="flex items-center gap-1">
          <UIcon name="i-lucide-bed" class="w-3.5 h-3.5" />
          {{ listing.property?.numberBedrooms }}
        </span>
        <span v-if="listing.property?.numberBathrooms" class="flex items-center gap-1">
          <UIcon name="i-lucide-bath" class="w-3.5 h-3.5" />
          {{ listing.property?.numberBathrooms }}
        </span>
        <span v-if="listing.property?.numberReceptions" class="flex items-center gap-1">
          <UIcon name="i-lucide-sofa" class="w-3.5 h-3.5" />
          {{ listing.property?.numberReceptions }}
        </span>
      </div>
    </div>
  </NuxtLink>
  <div v-else class="p-3 rounded-lg bg-elevated border">
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
      Listing information unavailable
    </p>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  listing: any
}>()
</script>