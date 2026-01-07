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
        <p class="font-normal">Total Listing Views: 
          <span class="font-bold italic text-secondary">
            {{ totalListingViews }} 
          </span>
        </p>
      </template>

      <template #description>
        <p class="text-foreground-secondary">
          {{ analytics?.percentageChange || 0 }}% increase in views compared to last month.
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
        <p class="font-normal">Listing Favourited: 
          <span class="font-bold italic text-secondary">
            {{ analytics?.favoritedByOthersCount || 0 }} 
          </span>
        </p>
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
        <p class="font-normal">Total Enquiries: 
          <span class="font-bold italic text-secondary">
            {{ analytics?.totalConversations || 0 }} 
          </span>
        </p>
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
  const { analytics } = useAnalytics();

const totalListingViews = computed(() => {
  return analytics.value?.totalViews || 0;
});
</script>