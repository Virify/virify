<template>
  <UPageCard :title="title" :ui="{ title: 'title-xs' }">
    <template #description>
      <span class="body-sm text-muted-foreground">{{ description }}</span>
    </template>
    <div class="overflow-x-auto">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <table class="w-full">
          <thead class="border-b border-border">
            <tr class="text-left body-sm text-muted-foreground">
              <th class="p-4">Listing</th>
              <th class="p-4 text-right">Views</th>
              <th class="p-4 text-right hidden sm:table-cell">Impressions</th>
              <th class="p-4 text-right hidden md:table-cell">CTR</th>
              <th class="p-4 text-right hidden lg:table-cell">Favourites</th>
              <th class="p-4 text-right hidden lg:table-cell">Enquiries</th>
              <th class="p-4 text-right hidden xl:table-cell">Avg. Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 3" :key="i" class="border-b border-border last:border-0">
              <td class="p-4">
                <USkeleton class="h-4 w-40 mb-2" />
                <USkeleton class="h-3 w-24" />
              </td>
              <td class="p-4 text-right"><USkeleton class="h-4 w-12 ml-auto" /></td>
              <td class="p-4 text-right hidden sm:table-cell"><USkeleton class="h-4 w-12 ml-auto" /></td>
              <td class="p-4 text-right hidden md:table-cell"><USkeleton class="h-4 w-10 ml-auto" /></td>
              <td class="p-4 text-right hidden lg:table-cell"><USkeleton class="h-4 w-8 ml-auto" /></td>
              <td class="p-4 text-right hidden lg:table-cell"><USkeleton class="h-4 w-8 ml-auto" /></td>
              <td class="p-4 text-right hidden xl:table-cell"><USkeleton class="h-4 w-12 ml-auto" /></td>
            </tr>
          </tbody>
        </table>
      </template>
      
      <!-- Data state -->
      <template v-else-if="listings.length > 0">
        <table class="w-full">
          <thead class="border-b border-border">
            <tr class="text-left body-sm text-muted-foreground">
              <th class="p-4">Listing</th>
              <th class="p-4 text-right">Views</th>
              <th class="p-4 text-right hidden sm:table-cell">Impressions</th>
              <th class="p-4 text-right hidden md:table-cell">CTR</th>
              <th class="p-4 text-right hidden lg:table-cell">Favourites</th>
              <th class="p-4 text-right hidden lg:table-cell">Enquiries</th>
              <th class="p-4 text-right hidden xl:table-cell">Avg. Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="listing in listings"
              :key="listing.id"
              class="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
            >
              <td class="p-4">
                <NuxtLink :to="`/listing/${listing.id}`" class="body-sm font-medium hover:text-secondary transition-colors line-clamp-1">
                  {{ listing.address }}
                </NuxtLink>
                <div class="body-sm text-muted-foreground">{{ listing.bedrooms }} bed · £{{ listing.price.toLocaleString() }}</div>
              </td>
              <td class="p-4 text-right body-sm font-medium">{{ listing.views.toLocaleString() }}</td>
              <td class="p-4 text-right body-sm hidden sm:table-cell">{{ listing.impressions.toLocaleString() }}</td>
              <td class="p-4 text-right body-sm hidden md:table-cell">{{ listing.ctr }}%</td>
              <td class="p-4 text-right body-sm hidden lg:table-cell">{{ listing.favourites }}</td>
              <td class="p-4 text-right body-sm hidden lg:table-cell">{{ listing.enquiries }}</td>
              <td class="p-4 text-right body-sm text-muted-foreground hidden xl:table-cell">{{ formatDuration(listing.avgDuration) }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      
      <!-- Empty state -->
      <div v-else class="text-center py-8">
        <UIcon name="i-lucide-home" class="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p class="body-sm text-muted-foreground">No listings yet</p>
        <p class="text-xs text-muted-foreground mt-1">Create your first listing to see analytics</p>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { formatDuration } from '~~/layers/analytics/utils/analytics-helpers';

interface TopListing {
  id: number;
  address: string;
  bedrooms: number;
  price: number;
  views: number;
  impressions: number;
  ctr: number;
  favourites: number;
  enquiries: number;
  avgDuration: number;
}

withDefaults(defineProps<{
  title?: string;
  description?: string;
  listings?: TopListing[];
  loading?: boolean;
}>(), {
  title: 'Top Performing Listings',
  description: 'Sorted by views',
  listings: () => [],
  loading: false,
});
</script>
