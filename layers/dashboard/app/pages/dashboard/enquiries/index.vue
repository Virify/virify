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
            v-model:active-tab="activeTab"
            @update:filtered="sortedAndFilteredConversations = $event"
          />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UPageList divide :class="[
        'gap-4',
        view === 'grid' && (loading || sortedAndFilteredConversations.length > 0) ? 'grid grid-cols-1 xl:grid-cols-2' : ''
      ]">
        <template v-if="loading">
          <OrganismsDashboardEnquiryCardSkeleton :cards="3" />
        </template>
        <template v-else-if="sortedAndFilteredConversations.length > 0">
          <OrganismsDashboardEnquiryCard
            v-for="enquiry in sortedAndFilteredConversations"
            :key="enquiry.id"
            :enquiry="enquiry"
            :user="user"
            @click="openModal(enquiry)"
            @reply="openModal"
          />
        </template>
        <OrganismsDashboardNoResults v-else :description="'No Enquiries found.'" />
      </UPageList>
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

  const { allConversations, loading } = useConversations();
  const { user } = useUserSession();

  const open = ref(false);
  const filterRef = ref();
  const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);
  const activeTab = ref<"all" | "unread">("all");
  const sortedAndFilteredConversations = ref<ConversationWithUserAndMessages[]>([]);
  const view = useCookie<'grid' | 'list'>('enquiries-view-preference', { default: () => 'grid', maxAge: 60 * 60 * 24 * 365 });

  /**
   * Filtered Conversations
   */
  const filteredConversations = computed(() => {
    if (activeTab.value === "all") {
      return allConversations.value;
    } else {
      return allConversations.value.filter((convo: ConversationWithUserAndMessages) => 
        // Optimization: Use .some() instead of counting all unread messages
        convo.messages?.some(m => !m.isRead && String(m.receiverId) === String(user.value?.id))
      );
    }
  });

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
