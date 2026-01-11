<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar class="border-0" :ui="{
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
            v-model:view="view"
            v-model:active-tab="conversationFilter"
            v-model:direction-filter="directionFilter"
            v-model:sort-order="sortOrder"
            @update:filtered="sortedAndFilteredConversations = $event"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPageList ref="pageTop" :class="[
        'gap-4 ',
        view === 'grid' && (loading || sortedAndFilteredConversations.length > 0) ? 'grid grid-cols-1 xl:grid-cols-2' : ''
      ]">
        <template v-if="loading">
          <OrganismsDashboardEnquiryCardSkeleton :cards="3" :view="view" />
        </template>
        <template v-else-if="sortedAndFilteredConversations.length > 0">
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
        <OrganismsDashboardNoResults v-else :description="'No Enquiries found.'" />
      </UPageList>

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination :v-model:page="page" @update:page="onPageChange" :total="total" :page-count="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
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

  const open = ref(false);
  const filterRef = ref();
  const page = ref(1);
  const limit = ref(30);
  const pageTop = ref<HTMLElement | null>(null);
  const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);
  const sortedAndFilteredConversations = ref<ConversationWithUserAndMessages[]>([]);
  const view = useCookie<'grid' | 'list'>('enquiries-view-preference', { default: () => 'grid', maxAge: 60 * 60 * 24 * 365 });
  const conversationFilter = useCookie<"all" | "unread">('enquiries-filter-preference', { default: () => 'all', maxAge: 60 * 60 * 24 * 365 });
  const directionFilter = useCookie<"all" | "sent" | "received">('enquiries-direction-preference', { default: () => 'all', maxAge: 60 * 60 * 24 * 365 });
  const sortOrder = useCookie<'newest' | 'oldest'>('enquiries-sort-preference', { default: () => 'newest', maxAge: 60 * 60 * 24 * 365 });

  // Filtered conversations come directly from API
  const filteredConversations = computed(() => allConversations.value);

  // Watch filter changes and re-fetch from API (reset to page 1)
  watch([conversationFilter, directionFilter, sortOrder], async () => {
    page.value = 1;
    await fetchConversations(conversationFilter.value, directionFilter.value, 1, sortOrder.value, limit.value);
  });

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
    open.value = !open.value;
    selectedConversation.value = conversation;
    filterRef.value?.close();
  }
</script>
