<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar class="body-sm border-0" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
      }">
        <template #title>
          Your Enquiries
        </template>
        <template #right>
          <UTabs :items="tabItems" default-value="all" size="sm" class="w-full" :content="false" v-model="activeTab" color="secondary" :ui="{
            trigger: 'data-[state=active]:text-white!',
            label: 'body-xs',
            
          }">
            <template #trailing="{ item }">
              <UBadge
                :label="item.value === 'all' ? allConversations.length : unreadConversationsCount" 
                variant="solid"
                color="secondary"
                size="md"
                :ui="{
                  base: 'border-1 border-white text-white',
                }"
              />
            </template>
          </UTabs>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <OrganismsDashboardFilter
        :items="filteredConversations"
        :date-key="'updatedAt'"
        enquiries
        :user-id="user?.id"
        @update:filtered="sortedAndFilteredConversations = $event"
      />
      <UPageList divide class="gap-4">
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
        <OrganismsDashboardEnquiryNoResultCard v-else />
      </UPageList>
      <OrganismsDashboardEnquiryModal
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

const { allConversations, loading, unreadConversationsCount } = useConversations();
const { user } = useUserSession();
const open = ref(false);

const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);
const activeTab = ref<"all" | "unread">("all");
const sortedAndFilteredConversations = ref<ConversationWithUserAndMessages[]>([]);

const filteredConversations = computed(() => {
  if (activeTab.value === "all") {
    return allConversations.value;
  } else {
    return allConversations.value.filter((convo: ConversationWithUserAndMessages) => 
      getUnreadCount(convo, user.value?.id) > 0
    );
  }
});

const tabItems = [
  { label: "All", value: "all", icon: "i-lucide-inbox" },
  { label: "Unread", value: "unread", icon: "i-lucide-mail" },
];

function openModal(conversation: ConversationWithUserAndMessages) {
  open.value = !open.value;
  selectedConversation.value = conversation;
}
</script>
