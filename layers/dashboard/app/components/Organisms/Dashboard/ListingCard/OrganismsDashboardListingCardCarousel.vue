<template>
  <div :class="items.length > 0 ? 'sm:px-10' : ''">
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <OrganismsDashboardListingCardSkeleton :cards="3" class="flex gap-4" />
    </div>
    <UCarousel
      v-else-if="items.length > 0"
      v-slot="{ item }"
      :items="items"
      class="pb-4"
      arrows
      align="start"
      :prev="{ variant: 'subtle', color: 'secondary' }"
      :next="{ variant: 'subtle', color: 'secondary' }"
      :ui="{ 
        container: 'items-stretch',
        item: 'basis-auto flex-none md:w-[420px] ps-4',
        prev: 'start-4 sm:-start-10',
        next: 'end-4 sm:-end-10',
      }"
    >
      <OrganismsDashboardListingCard 
        :listing="item.listing!" 
        :fav="type === 'favourites' ? item.createdAt : undefined"
        :note="type === 'notes' ? item.updatedAt : undefined"
        class="h-full" 
      />
    </UCarousel>
    <OrganismsDashboardNoResults v-else :description="emptyMessage" />
  </div>
</template>

<script lang="ts" setup>
type CarouselType = 'favourites' | 'notes' | 'viewed'

interface Props {
  items: any[]
  loading: boolean
  type: CarouselType
  emptyMessage: string
}

defineProps<Props>()
</script>
