<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        class="border-0"
        title="Enquiry Details"
        :ui="{
          title: 'title-sm m-0!',
          left: 'flex items-center gap-2',
        }"
      >
        <template #right>
          <OrganismsDashboardFilter 
            :items="enquiries" 
            :enquiries="true" 
            persistence-key="dashboard-listing-enquiries" 
            :all-count="allCount" 
            :unread-count="unreadCountLocal" 
            @update:filtered="filteredEnquiries = $event" 
            :view-options="[]" 

          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <MoleculesDashboardBreadcrumb />

      <div class="grid xl:grid-cols-3 gap-6 mt-0 items-start">
        <!-- Left: Listing Card (Sticky) -->
        <div class="hidden xl:block xl:col-span-1 sticky top-0">
          <OrganismsDashboardListingCardEnquiryLarge v-if="persistentListing" :listing="persistentListing" />
          <USkeleton v-else class="h-64 w-full" />
        </div>

        <!-- Right: Conversations Feed -->
        <div class="xl:col-span-2 flex flex-col gap-4 w-full">
          <!-- Mobile Listing Card -->
          <div class="xl:hidden v-full" v-if="persistentListing">
            <OrganismsDashboardListingCardEnquiryLarge :listing="persistentListing" />
          </div>

          <!-- Loading State -->
          <div v-if="loading && !enquiries.length" class="space-y-4">
            <USkeleton class="h-32 w-full" v-for="i in 3" :key="i" />
          </div>

          <!-- Results (Filtered) -->
          <div v-else-if="filteredEnquiries.length > 0" class="space-y-3 w-full">
            <UPageCard
              v-for="enquiry in filteredEnquiries"
              :key="enquiry.id"
              variant="subtle"
              :ui="{
                root: 'cursor-pointer transition-colors w-full',
                container: 'p-0 sm:p-0',
                body: 'w-full',
              }"
              @click="handleOpenModal(enquiry)"
            >
              <template #body>
                <!-- Header -->
                <div class="flex justify-between items-center p-3">
                  <div class="flex items-center gap-2">
                    <UAvatar :name="getConversationOtherUser(enquiry, user?.id)?.username || 'User'" :alt="getConversationOtherUser(enquiry, user?.id)?.username || 'User'" size="xs" class="bg-(--background-200) text-(--foreground-100)" />
                    <span class="text-sm font-bold text-(--foreground-100)">
                      {{ getConversationOtherUser(enquiry, user?.id)?.username || "User" }}
                    </span>
                  </div>
                  <span class="text-xs text-(--foreground-200)">
                    {{ formatMessageTimestamp(enquiry.updatedAt) }}
                  </span>
                </div>
                <!-- Content -->
                <OrganismsDashboardEnquiryMessageSummary :enquiry="enquiry" :user="user" @reply="handleOpenModal" />
              </template>
            </UPageCard>
          </div>

          <!-- No Results -->
          <OrganismsDashboardNoResults v-else :description="'No conversations found matching your filters.'" />
        </div>
      </div>

      <OrganismsDashboardEnquiryModal 
        v-if="user" 
        v-model:open="modalOpen" 
        :conversation="activeEnquiry" 
        :user="user" 
      />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  title: "Listing Enquiries",
  layout: "dashboard",
});

const route = useRoute();
const { user } = useUserSession();
const requestFetch = useRequestFetch();

// State from useEnquiries
const { enquiries, total: totalCount, loading, fetchEnquiries, activeEnquiry, openEnquiry, closeEnquiry, getUnreadCount } = useEnquiries();
const filteredEnquiries = ref<ConversationWithMinimalListing[]>([]);;

const listingId = computed(() => Number(route.params.id));

const modalOpen = ref(false);

// Filter Logic
const filterState = useDashboardListFilter(ref([]), { 
  persistenceKey: "dashboard-listing-enquiries", 
  enquiries: true,
  hideListingSort: true
});
const { activeTab: enquiryFilter, enquiriesFilter: directionFilter, sortOrderValue: sortOrder } = filterState;

// Determine the listing object from the fetched conversations or separate fetch
const persistentListing = ref<any>(null);

// Fetch listing details explicitly to handle cases where conversations don't exist yet
const { data: fetchedListing } = await useAsyncData(`listing-${listingId.value}`, () => requestFetch<any>(`/api/listings/${listingId.value}`), {
  watch: [listingId],
  immediate: true,
});

// Update persistentListing when fetchedListing changes
watch(
  fetchedListing,
  (newListing) => {
    if (newListing) {
      persistentListing.value = newListing;
    }
  },
  { immediate: true }
);

const allCount = computed(() => {
  if (realAllCount.value > 0) return realAllCount.value;
  return totalCount.value;
});

// Capture the total count when we are viewing 'all'
const realAllCount = ref(0);
watch(totalCount, (newVal) => {
  if (enquiryFilter.value === 'all') {
    realAllCount.value = newVal;
  }
});

const unreadCountLocal = computed(() => {
  return enquiries.value.filter((c) => getUnreadCount(c) > 0).length;
});

watch([enquiryFilter, directionFilter, sortOrder], async () => {
  if (listingId.value) {
    await fetchEnquiries({ 
      filter: enquiryFilter.value as any, 
      direction: directionFilter.value as any, 
      page: 1, 
      sort: sortOrder.value as any, 
      limit: 50, 
      listingId: listingId.value 
    });
  }
});

onMounted(() => {
  if (listingId.value) {
    fetchEnquiries({ 
      filter: enquiryFilter.value as any, 
      direction: directionFilter.value as any, 
      page: 1, 
      sort: sortOrder.value as any, 
      limit: 50, 
      listingId: listingId.value 
    });
  }
});

function handleOpenModal(enquiry: ConversationWithMinimalListing) {
  openEnquiry(enquiry);
  modalOpen.value = true;
}

// Close modal and clear active enquiry
watch(modalOpen, (isOpen) => {
  if (!isOpen) {
    closeEnquiry();
  }
});
</script>
