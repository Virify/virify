<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <UPageCard
      icon="i-lucide-eye"
      spotlight
      spotlight-color="secondary"
      :ui="{
        root: 'bg-(--background-200)',
        leadingIcon: 'text-secondary',
        title: 'body-sm font-bold',
        description: 'body-xs text-muted-foreground',
      }"
    >
      <template #title>
        <template v-if="isLoading">
          Total Listing Views: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
        </template>
        <template v-else>
          Total Listing Views: <span class="text-secondary">{{ totalListingViews }}</span>
        </template>
      </template>
      <template #description>
        {{ analytics?.percentageChange || 0 }}% vs last month
      </template>
    </UPageCard>

    <UPageCard
      icon="i-lucide-trending-up"
      variant="subtle"
      spotlight
      spotlight-color="secondary"
      :ui="{
        root: 'bg-(--background-200)',
        leadingIcon: 'text-secondary',
        title: 'body-sm font-bold',
        description: 'body-xs text-muted-foreground',
      }"
    >
      <template #title>
        <template v-if="isLoading">
          Last Month Views: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
        </template>
        <template v-else>
          Last Month Views: <span class="text-secondary">{{ analytics?.previousMonthViews || 0 }}</span>
        </template>
      </template>
      <template #description>
        Previous period
      </template>
    </UPageCard>

    <UPageCard
      icon="i-lucide-heart"
      variant="subtle"
      spotlight
      spotlight-color="secondary"
      :ui="{
        root: 'bg-(--background-200)',
        leadingIcon: 'text-secondary',
        title: 'body-sm font-bold',
        description: 'body-xs text-muted-foreground',
      }"
    >
      <template #title>
        <template v-if="isLoading">
          Listings Favourited: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
        </template>
        <template v-else>
          Listings Favourited: <span class="text-secondary">{{ analytics?.favoritedByOthersCount || 0 }}</span>
        </template>
      </template>
      <template #description>
        By searchers
      </template>
    </UPageCard>

    <UPageCard
      icon="i-lucide-message-circle"
      variant="subtle"
      spotlight
      spotlight-color="secondary"
      :ui="{
        root: 'bg-(--background-200)',
        leadingIcon: 'text-secondary',
        title: 'body-sm font-bold',
        description: 'body-xs text-muted-foreground',
      }"
    >
      <template #title>
        <template v-if="isLoading">
          Total Enquiries: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
        </template>
        <template v-else>
          Total Enquiries: <span class="text-secondary">{{ analytics?.totalConversations || 0 }}</span>
        </template>
      </template>
      <template #description>
        On your listings
      </template>
    </UPageCard>
  </div>
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
