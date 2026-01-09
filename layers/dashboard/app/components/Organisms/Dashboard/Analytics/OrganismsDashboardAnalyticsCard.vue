<template>
  <UPageColumns>
    <UPageCard 
      icon="i-lucide-eye"
      variant="subtle"
      :ui="{
        leadingIcon: 'text-secondary',
      }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <p class="font-normal text-sm text-gray-500 dark:text-gray-400">Total Listing Views</p>
          <template v-if="isLoading">
            <USkeleton class="h-8 w-20 bg-primary/25" />
          </template>
          <template v-else>
            <p class="text-3xl font-bold italic text-secondary">
              {{ totalListingViews }} 
            </p>
          </template>
        </div>
      </template>

      <template #description>
        <div class="text-foreground-secondary body-sm">
          <template v-if="isLoading">
            <USkeleton class="h-4 w-10 inline-block align-sub bg-primary/25" /> increase in views compared to last month.
          </template>
          <template v-else>
            <p>{{ analytics?.percentageChange || 0 }}% increase in views compared to last month.</p>
          </template>
        </div>
      </template>
    </UPageCard>

    <UPageCard 
      icon="i-lucide-heart"
      variant="subtle"
      :ui="{
        leadingIcon: 'text-secondary'
      }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <p class="font-normal text-sm text-gray-500 dark:text-gray-400">Listings Favourited</p>
          <template v-if="isLoading">
            <USkeleton class="h-8 w-20 bg-primary/25" />
          </template>
          <template v-else>
            <p class="text-3xl font-bold italic text-secondary">
              {{ analytics?.favoritedByOthersCount || 0 }} 
            </p>
          </template>
        </div>
      </template>

      <template #description>
        <p>
          Listings favourited by searchers.
        </p>
      </template>
    </UPageCard>

    <UPageCard 
      icon="i-lucide-message-circle"
      variant="subtle"
      :ui="{
        leadingIcon: 'text-secondary'
      }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <p class="font-normal text-sm text-gray-500 dark:text-gray-400">Total Enquiries</p>
          <template v-if="isLoading">
            <USkeleton class="h-8 w-20 bg-primary/25" />
          </template>
          <template v-else>
            <p class="text-3xl font-bold italic text-secondary">
              {{ analytics?.totalConversations || 0 }} 
            </p>
          </template>
        </div>
      </template>

      <template #description>
        <p>
          Total enquiries received on your listings.
        </p>
      </template>
    </UPageCard>

  </UPageColumns>
</template>
<script lang="ts" setup>
  const { analytics, isAnalyticsLoading: isLoading } = useAnalytics();

  /**
   * Total Listing Views Computed
   */
  const totalListingViews = computed(() => {
    return analytics.value?.totalViews || 0;
  });
</script>