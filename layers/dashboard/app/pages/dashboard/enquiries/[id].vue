<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar class="border-0" title="Enquiry Details" :ui="{
        title: 'title-sm m-0!',
        left: 'flex items-center gap-2',
      }">
      </UDashboardNavbar>
    </template>

    <template #body>
      <MoleculesDashboardBreadcrumb />

      <div v-if="loading" class="flex flex-col gap-4 p-4">
        <USkeleton class="h-64 w-full" />
        <USkeleton class="h-32 w-full" />
        <USkeleton class="h-32 w-full" />
      </div>

      <div v-else-if="currentListingConversations.length > 0" class="p-4 max-w-4xl mx-auto w-full">
        <OrganismsDashboardEnquiryListingDetail :listing="currentListing" :conversations="currentListingConversations"
          :user="user" @click="openModal" @reply="openModal" />
      </div>

      <OrganismsDashboardNoResults v-else :description="'No conversations found for this listing.'" />

      <OrganismsDashboardEnquiryModal v-if="user" v-model:open="open" :conversation="selectedConversation"
        :user="user" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from '~~/shared/types/conversation';

definePageMeta({
  middleware: ["authenticated"],
  title: "Listing Enquiries",
  layout: "dashboard",
});

const route = useRoute();
const router = useRouter();
const { user } = useUserSession();
const requestFetch = useRequestFetch();
// Use local state instead of shared state to prevent blocking/hydration issues
const conversations = ref<ConversationWithUserAndMessages[]>([]);
const totalCount = ref(0);
const loading = ref(true);

const listingId = computed(() => Number(route.params.id));

const open = ref(false);
const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);
const filterRef = ref();

// Determine the listing object from the fetched conversations
const currentListing = computed(() => {
  return conversations.value.find(c => c.listing)?.listing || null;
});

const currentListingConversations = computed(() => conversations.value);
const allCount = computed(() => totalCount.value);
const unreadCount = computed(() => {
  return conversations.value.filter(c => getUnreadCount(c, user.value?.id) > 0).length;
});

// Filter logic
const {
  activeTab: conversationFilter,
  enquiriesFilter: directionFilter,
  sortOrderValue: sortOrder, 
} = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-listing-enquiries', enquiries: true });

async function fetchLocalConversations(
  filter: string, 
  direction: string, 
  page: number, 
  sort: string, 
  limit: number, 
  listingId: number
) {
    loading.value = true;
    try {
      const url = `/api/conversation/?filter=${filter}&direction=${direction}&sort=${sort}&page=${page}&limit=${limit}&listingId=${listingId}`;
      const data = await requestFetch<{ conversations: ConversationWithUserAndMessages[], total: number }>(url);
      conversations.value = data.conversations || [];
      totalCount.value = data.total || 0;
    } catch (e) {
      console.error("Failed to fetch listing conversations", e);
    } finally {
      loading.value = false;
    }
}

watch([conversationFilter, directionFilter, sortOrder], async () => {
   if (listingId.value) {
    await fetchLocalConversations(
      conversationFilter.value, 
      directionFilter.value, 
      1, 
      sortOrder.value, 
      50, 
      listingId.value
    );
   }
});

onMounted(() => {
  if (listingId.value) {
    // Fetch conversations for this listing
     fetchLocalConversations(
      conversationFilter.value, 
      directionFilter.value, 
      1, 
      sortOrder.value, 
      50, 
      listingId.value
    );
  }
});

function openModal(conversation: ConversationWithUserAndMessages) {
  open.value = true;
  selectedConversation.value = conversation;
}
</script>
