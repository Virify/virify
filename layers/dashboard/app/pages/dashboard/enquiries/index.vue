<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{
        title: 'title-sm m-0!',
        right: 'flex items-center gap-4',
      }">
        <template #title>
          Your Enquiries
        </template>

        <template #right>
          <OrganismsDashboardFilter
            ref="filterRef"
            :items="filteredConversations"
            :date-key="'updatedAt'"
            enquiries
            :user-id="user?.id"
            :view-options="viewOptions"
            persistence-key="dashboard-enquiries"
            @update:filtered="sortedAndFilteredConversations = $event"
          />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>
    <template #body>
      <MoleculesDashboardBreadcrumb />
      <UPageList ref="pageTop" :class="[
        'gap-4',
        view === 'grid' && (loading || sortedAndFilteredConversations.length > 0) 
          ? (sortOrder === 'listing' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 uw-grid' : 'grid grid-cols-1 xl:grid-cols-2') 
          : ''
      ]">
        <template v-if="loading">
          <OrganismsDashboardEnquiryCardSkeleton :cards="3" :view="view" />
        </template>
        <template v-else-if="sortedAndFilteredConversations.length > 0 && sortOrder !== 'listing'">
          <OrganismsDashboardEnquiryCard
            v-for="enquiry in sortedAndFilteredConversations"
            :key="enquiry.id"
            :enquiry="enquiry"
            :user="user"
            :view="view"
            @click="openModal(enquiry)"
            @reply="openModal"
          />
        </template>
        <template v-else-if="sortedAndFilteredConversations.length > 0 && sortOrder === 'listing'">
            <OrganismsDashboardEnquiryGroup
              v-for="group in groupedByListing"
              :key="group.listing?.id ?? 'general'"
              :group="group"
              :user="user"
              @click="openListingDetail"
            />
        </template>
        <OrganismsDashboardNoResults v-else :description="'No Enquiries found.'" />
      </UPageList>

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>

      <OrganismsDashboardEnquiryModal
        v-if="user"
        v-model:open="open"
        :conversation="selectedConversation"
        :user="user"
      />
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
  definePageMeta({
    middleware: ["authenticated"],
    head: {
      title: "Your Enquiries",
      icon: "i-lucide-home",
    },
    layout: "dashboard",
  });

  const { allConversations, loading, fetchConversations, total } = useConversations({ limit: 30 });
  const { user } = useUserSession();
  const router = useRouter();

  const open = ref(false);
  const filterRef = ref();
  const page = ref(1);
  const limit = ref(20);
  const pageTop = ref<HTMLElement | null>(null);
  const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);
  const sortedAndFilteredConversations = ref<ConversationWithUserAndMessages[]>([]);
  
  const { 
    activeView: view,
    activeTab: conversationFilter,
    enquiriesFilter: directionFilter,
    sortOrderValue: sortOrder,
    viewOptions
  } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-enquiries' });

  // Filtered conversations come directly from API
  const filteredConversations = computed(() => allConversations.value);

  
  const groupedByListing = computed(() => {
    if (sortOrder.value !== 'listing') return [];
    
    // Manual Grouping for what we have in memory (which matches backend "take" logic roughly now)
    const groups = new Map<number | string, { listing: any, conversations: ConversationWithUserAndMessages[] }>();
    
    sortedAndFilteredConversations.value.forEach(c => {
      const listing = c.listing;
      const key = listing?.id ?? 'general';
      
      if (!groups.has(key)) {
        groups.set(key, { listing, conversations: [] });
      }
      groups.get(key)!.conversations.push(c);
    });
    
    return Array.from(groups.values());
  });

  // Watch filter changes and re-fetch from API (reset to page 1)
  watch([conversationFilter, directionFilter, sortOrder], async () => {
    page.value = 1;
    await fetchConversations(conversationFilter.value, directionFilter.value, 1, sortOrder.value, limit.value);
  }, { immediate: true });

  // Handle page changes from pagination component
  async function onPageChange(newPage: number) {    // Remove focus from pagination button to prevent browser fighting the scroll
    page.value = newPage;

    await fetchConversations(conversationFilter.value, directionFilter.value, newPage, sortOrder.value, limit.value);

    const el = (pageTop.value as any)?.$el ?? pageTop.value;
    const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto');
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Open Enquiry Modal
   * @param conversation Conversation with User
   */
  function openModal(conversation: ConversationWithUserAndMessages) {
    if (!conversation?.id) return;
    open.value = !open.value;
    selectedConversation.value = conversation;
    filterRef.value?.close();
  }

  function openListingDetail(listingId?: number) {
     if (listingId) {
        router.push(`/dashboard/enquiries/${listingId}`);
     }
  }
</script>
