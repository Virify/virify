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
            :items="conversations" 
            :enquiries="true" 
            persistence-key="dashboard-listing-enquiries" 
            :all-count="allCount" 
            :unread-count="unreadCount" 
            @update:filtered="filteredConversations = $event" 
            :view-options="[]" 
          />
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
          <div v-if="loading && !conversations.length" class="space-y-4">
            <USkeleton class="h-32 w-full" v-for="i in 3" :key="i" />
          </div>

          <!-- Results (Filtered) -->
          <div v-else-if="filteredConversations.length > 0" class="space-y-3 w-full">
            <UPageCard
              v-for="enquiry in filteredConversations"
              :key="enquiry.id"
              variant="subtle"
              :ui="{
                root: 'cursor-pointer transition-colors w-full',
                container: 'p-0 sm:p-0',
                body: 'w-full',
              }"
              @click="openModal(enquiry)"
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
                <OrganismsDashboardEnquiryMessageSummary :enquiry="enquiry" :user="user" @reply="openModal" />
              </template>
            </UPageCard>
          </div>

          <!-- No Results -->
          <OrganismsDashboardNoResults v-else :description="'No conversations found matching your filters.'" />
        </div>
      </div>

      <OrganismsDashboardEnquiryModal v-if="user" v-model:open="open" :conversation="selectedConversation" :user="user" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";
import { getConversationOtherUser, formatMessageTimestamp, getUnreadCount } from "~/utils/conversation";

definePageMeta({
  middleware: ["authenticated"],
  title: "Listing Enquiries",
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const { user } = useUserSession();
const requestFetch = useRequestFetch();

// State
const { conversations, total: totalCount, loading, fetchConversations } = useConversations();
const filteredConversations = ref<ConversationWithUserAndMessages[]>([]); // Results from client-side search/filter component

const listingId = computed(() => Number(route.params.id));

const open = ref(false);
const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);

// Filter Logic
const filterState = useDashboardListFilter(ref([]), { 
  persistenceKey: "dashboard-listing-enquiries", 
  enquiries: true,
  hideListingSort: true // New option
});
const { activeTab: conversationFilter, enquiriesFilter: directionFilter, sortOrderValue: sortOrder } = filterState;

// Determine the listing object from the fetched conversations or separate fetch
const persistentListing = ref<any>(null);

// Fetch listing details explicitly to handle cases where conversations don't exist yet
const { data: fetchedListing } = await useAsyncData(`listing-${listingId.value}`, () => requestFetch<any>(`/api/listings/${listingId.value}`), {
  watch: [listingId],
  immediate: true,
});

// Unified listing object computation
const currentListing = computed(() => {
  // Prefer the explicitly fetched listing
  if (fetchedListing.value) return fetchedListing.value;

  // Fallback to finding it in conversations (less reliable if filtered)
  const list = conversations.value.find((c) => c.listing)?.listing;
  if (list) persistentListing.value = list;
  return list || persistentListing.value;
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
  if (conversationFilter.value === 'all') {
    realAllCount.value = newVal;
  }
});

const unreadCount = computed(() => {
  return conversations.value.filter((c) => getUnreadCount(c, user.value?.id) > 0).length; // This is only for current page, ideally should come from API metadata
  // Given we fetch "conversations", we might not have global unread count for this listing unless API returns it.
  // But we can just use current page's unread count for now or rely on the global aggregates if we had them per-listing (we don't).
  // The 'totalCount' from API is total conversations matching filter.
});

watch([conversationFilter, directionFilter, sortOrder], async () => {
  if (listingId.value) {
    await fetchConversations(conversationFilter.value as any, directionFilter.value as any, 1, sortOrder.value as any, 50, listingId.value);
  }
});

onMounted(() => {
  if (listingId.value) {
    // Fetch conversations for this listing
    fetchConversations(conversationFilter.value as any, directionFilter.value as any, 1, sortOrder.value as any, 50, listingId.value);
  }
});

function openModal(conversation: ConversationWithUserAndMessages) {
  open.value = true;
  selectedConversation.value = conversation;
}
</script>
