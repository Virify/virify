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
          <span class="font-normal text-sm text-gray-500 dark:text-gray-400">Total Listing Views</span>
          <USkeleton v-if="isLoading" class="h-8 w-20 bg-primary/25" />
          <span v-else class="text-3xl font-bold italic text-secondary">
            {{ totalListingViews }} 
          </span>
        </div>
      </template>

      <template #description>
        <p class="text-foreground-secondary">
          <USkeleton v-if="isLoading" class="h-4 w-10 inline-block align-sub bg-primary/25" />
          <span v-else>{{ analytics?.percentageChange || 0 }}%</span>
          increase in views compared to last month.
        </p>
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
          <span class="font-normal text-sm text-gray-500 dark:text-gray-400">Listings Favourited</span>
          <USkeleton v-if="isLoading" class="h-8 w-20 bg-primary/25" />
          <span v-else class="text-3xl font-bold italic text-secondary">
            {{ analytics?.favoritedByOthersCount || 0 }} 
          </span>
        </div>
      </template>

      <template #description>
        <p class="text-foreground-secondary">
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
          <span class="font-normal text-sm text-gray-500 dark:text-gray-400">Total Enquiries</span>
          <USkeleton v-if="isLoading" class="h-8 w-20 bg-primary/25" />
          <span v-else class="text-3xl font-bold italic text-secondary">
            {{ analytics?.totalConversations || 0 }} 
          </span>
        </div>
      </template>

      <template #description>
        <p class="text-foreground-secondary">
          Total enquiries received on your listings.
        </p>
      </template>
    </UPageCard>

  </UPageColumns>
</template>
<script lang="ts" setup>
  const { analytics, isAnalyticsLoading: isLoading } = useAnalytics();

const totalListingViews = computed(() => {
  return analytics.value?.totalViews || 0;
});
</script>