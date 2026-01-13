<template>
  <div 
    v-if="listing" 
    class="flex flex-col h-auto w-full rounded-lg bg-(--background-100) overflow-hidden"
  >
    <!-- Large Image -->
    <div 
      v-if="listing.property?.media?.[0]?.image" 
      class="w-full shrink-0"
    >
      <AtomsCloudFlareImage
        :src="listing.property.media[0].image"
        :alt="listing.property.address?.fullAddress || 'Property'"
        class="w-full h-full object-cover aspect-video"
        variant="public"
      />
    </div>
    
    <div class="flex flex-col gap-2 p-4">
      <div class="flex items-center justify-between gap-2">
        <p class="text-xl font-bold text-secondary leading-none">
          {{ formatCurrency((listing.price)) }}
        </p>
        <UBadge
          :label="listing.rentalListing ? 'To Rent' : 'For Sale'"
          color="secondary"
          variant="soft"
          size="md"
        />
      </div>
      
      <p class="text-sm font-medium text-foreground">
        {{ listing.property?.address?.fullAddress || 'Address not available' }}
      </p>

      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ listing.property?.type?.name || 'Property Type N/A' }}
      </p>
      
      <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
        <span v-if="listing.property?.numberBedrooms" class="flex items-center gap-2">
          <UIcon name="i-lucide-bed" class="w-4 h-4" />
          <span>{{ listing.property?.numberBedrooms }} Bed</span>
        </span>
        <span v-if="listing.property?.numberBathrooms" class="flex items-center gap-2">
          <UIcon name="i-lucide-bath" class="w-4 h-4" />
          <span>{{ listing.property?.numberBathrooms }} Bath</span>
        </span>
        <span v-if="listing.property?.numberReceptions" class="flex items-center gap-2">
          <UIcon name="i-lucide-sofa" class="w-4 h-4" />
          <span>{{ listing.property?.numberReceptions }} Reception</span>
        </span>
      </div>
    </div>
  </div>
  <div v-else class="p-3 rounded-lg bg-elevated border">
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
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
