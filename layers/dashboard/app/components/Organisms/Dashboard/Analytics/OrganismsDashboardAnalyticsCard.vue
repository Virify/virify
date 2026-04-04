<template>
  <div class="space-y-6">
    <!-- SELLER ANALYTICS (First 4) -->
    <div>
      <h3 class="body-sm font-bold text-muted-foreground pb-2">Your Listings Performance</h3>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UPageCard
          icon="i-lucide-eye"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Total Views: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Total Views: <span class="text-secondary">{{ totalListingViews }}</span>
            </template>
          </template>
          <template #description>
            {{ analytics?.percentageChange || 0 }}% vs last month
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-check-circle"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-100% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Active Listings: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Active Listings: <span class="text-secondary">{{ analytics?.activeListings || 0 }}</span>
            </template>
          </template>
          <template #description>
            Currently published
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-trending-up"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Last Month: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Last Month: <span class="text-secondary">{{ analytics?.previousMonthViews || 0 }}</span>
            </template>
          </template>
          <template #description>
            Views last period
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-message-circle"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Enquiries: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Enquiries: <span class="text-secondary">{{ analytics?.totalConversations || 0 }}</span>
            </template>
          </template>
          <template #description>
            On your listings
          </template>
        </UPageCard>
      </div>
    </div>

    <!-- BUYER ANALYTICS (Second 4) -->
    <div>
      <h3 class="body-sm font-bold text-muted-foreground pb-2">Your Search Activity</h3>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UPageCard
          icon="i-lucide-send"
          :to="buildEnquiriesUrl({ direction: 'sent', sort: 'newest' })"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Enquiries Sent: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Enquiries Sent: <span class="text-secondary">{{ analytics?.sentEnquiries || 0 }}</span>
            </template>
          </template>
          <template #description>
            Total enquiries made
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-reply"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              With Replies: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              With Replies: <span class="text-secondary">{{ analytics?.sentEnquiriesWithReplies || 0 }}</span>
            </template>
          </template>
          <template #description>
            {{ responseRate }}% response rate
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-heart"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Favourites: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Favourites: <span class="text-secondary">{{ analytics?.totalFavourites || 0 }}</span>
            </template>
          </template>
          <template #description>
            Listings saved
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-sticky-note"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat [background-position:right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        >
          <template #title>
            <template v-if="isLoading">
              Notes: <USkeleton class="h-4 w-8 inline-block align-middle bg-primary/25" />
            </template>
            <template v-else>
              Notes: <span class="text-secondary">{{ analytics?.totalNotes || 0 }}</span>
            </template>
          </template>
          <template #description>
            Notes created
          </template>
        </UPageCard>
      </div>
    </div>
    
    <!-- View Full Analytics Link -->
    <div class="flex justify-end">
      <UButton
        to="/dashboard/analytics"
        variant="link"
        color="primary"
        trailing-icon="i-lucide-arrow-right"
        class="text-sm"
      >
        View full analytics with graphs
      </UButton>
    </div>
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

/**
 * Response Rate Computed
 */
const responseRate = computed(() => {
  const sent = analytics.value?.sentEnquiries || 0;
  const replied = analytics.value?.sentEnquiriesWithReplies || 0;
  if (sent === 0) return 0;
  return Math.round((replied / sent) * 100);
});
</script>
