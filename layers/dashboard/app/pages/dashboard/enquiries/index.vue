<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Your Enquiries" class="body-sm border-0" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
      }"/>
      <!-- <OrganismsDashboardNavigationSearch :title="'Your Enquiries'" /> -->
    </template>
    <template #body>
      <UPageList divide class="gap-4">
        <UPageCard
          v-for="enquiry in allConversations"
          :key="enquiry.id"
          variant="outline"
          :ui="{
            root: 'cursor-pointer gap-2!',
            header: 'body-sm w-full flex justify-between items-center mb-2',
            body: 'w-full',
            container: 'p-4!',
          }"
          @click="openModal(enquiry)"
        >
          <template #header>
            <div>
              <UAvatar
                :name="enquiry.sender?.username || 'User'"
                :alt="enquiry.sender.username!"
                size="sm"
                class="mr-2"
              />
              <p class="inline font-bold">{{ enquiry.sender?.username || 'User' }}</p>
            </div>
            <p class="self-end">{{ formatMessageTimestamp(enquiry.updatedAt) }}</p>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <!-- Column 1: Listing Card -->
              <div 
                v-if="enquiry.listing" 
                class="flex gap-3 p-3 h-auto w-full rounded-lg bg-elevated"
              >
                <div 
                  v-if="enquiry.listing.property?.media?.[0]?.image" 
                  class="w-16 h-16 rounded-md overflow-hidden shrink-0"
                >
                  <AtomsCloudFlareImage
                    :src="enquiry.listing.property.media[0].image"
                    :alt="enquiry.listing.property.address?.fullAddress || 'Property'"
                    class="w-full h-full object-cover"
                    variant="thumbnail"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <p class="text-base font-bold text-secondary leading-none">
                      {{ formatCurrency((enquiry.listing.price)) }}
                    </p>
                    <UBadge
                      :label="enquiry.listing.rentalListing ? 'To Rent' : 'For Sale'"
                      color="secondary"
                      variant="soft"
                      size="md"
                    />
                  </div>
                  <p class="text-xs font-medium text-foreground mb-1">
                    {{ enquiry.listing.property?.type?.name || 'Property Type N/A' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                    {{ enquiry.listing.property?.address?.fullAddress || 'Address not available' }}
                  </p>
                  <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span v-if="enquiry.listing.property?.numberBedrooms" class="flex items-center gap-1">
                      <UIcon name="i-lucide-bed" class="w-3.5 h-3.5" />
                      {{ enquiry.listing.property?.numberBedrooms }}
                    </span>
                    <span v-if="enquiry.listing.property?.numberBathrooms" class="flex items-center gap-1">
                      <UIcon name="i-lucide-bath" class="w-3.5 h-3.5" />
                      {{ enquiry.listing.property?.numberBathrooms }}
                    </span>
                    <span v-if="enquiry.listing.property?.numberReceptions" class="flex items-center gap-1">
                      <UIcon name="i-lucide-sofa" class="w-3.5 h-3.5" />
                      {{ enquiry.listing.property?.numberReceptions }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="p-3 rounded-lg bg-elevated border">
                <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <UIcon name="i-lucide-alert-circle" class="inline w-4 h-4 mr-1" />
                  Listing information unavailable
                </p>
              </div>

              <!-- Column 2: Last Message and Reply Button -->
              <div class="flex flex-col gap-3 p-3 rounded-lg bg-elevated">
                <div class="flex items-start gap-2 flex-1">
                  <UIcon 
                    :name="isLastMessageFromUser(enquiry) ? 'i-lucide-corner-down-right' : 'i-lucide-corner-down-left'" 
                    class="w-4 h-4 mt-0.5 shrink-0"
                    :class="isLastMessageFromUser(enquiry) ? 'text-secondary' : 'text-gray-400'"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {{ isLastMessageFromUser(enquiry) ? 'You' : (getOtherUser(enquiry).username || formatPartnerName(getOtherUser(enquiry).email || 'Them')) }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {{ getLastMessageContent(enquiry) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-2 mt-auto">
                  <div class="flex items-center gap-2">
                    <UIcon 
                      :name="getUnreadCount(enquiry) > 0 ? 'i-lucide-mail' : 'i-lucide-mail-open'" 
                      class="w-4 h-4"
                      :class="getUnreadCount(enquiry) > 0 ? 'text-secondary' : 'text-gray-400'"
                    />
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                      {{ getUnreadCount(enquiry) > 0 ? `${getUnreadCount(enquiry)} unread` : 'All read' }}
                    </span>
                  </div>
                  <UButton
                    icon="i-lucide-reply"
                    size="xs"
                    variant="solid"
                    color="secondary"
                    class="body-xs text-white!"
                    @click.stop="openModal(enquiry)"
                  >
                    Reply
                  </UButton>
                </div>
              </div>
            </div>
          </template>
        </UPageCard>
      </UPageList>
      <UModal
        v-model:open="open"
        :fullscreen="isMobile"
        :ui="{
          overlay: 'bg-black/50 backdrop-blur-sm',
          content: 'max-w-[1300px] w-full sm:w-[90vw]',
        }"
      >
        <template #title>
          <h2 class="body-sm">{{ selectedConversation.listing?.user?.username || "Listing Unavailable" }}</h2>
        </template>
        <template #body>
          <div ref="chatContainer" class="overflow-y-auto px-4 scroll-smooth" :class="isMobile ? 'h-full' : 'h-[60vh]'">
            <UChatMessages should-auto-scroll>
              <UChatMessage
                v-for="message in messages"
                :variant="isMessageFromUser(message, user?.id!) ? 'soft' : 'subtle'"
                :key="message.id"
                :side="isMessageFromUser(message, user?.id!) ? 'left' : 'right'"
                :parts="[
                  {
                    text: message.content,
                  },
                ]"
                :id="message.id"
                :ui="{
                  container: 'pb-1',
                  content: 'text-white min-w-60' + (isMessageFromUser(message, user?.id!) ? ' bg-secondary/90' : ' bg-primary/100'),
                }"
              >
                <template #content>
                  <p class="body-xs italic pb-1">{{ formatMessageTimestamp(message.createdAt) }}</p>
                  <p class="body-md break-all whitespace-pre-wrap">{{ message.content }}</p>
                  <div class="flex mt-1 items-center gap-1">
                    <UAvatar :alt="message.sender.username!" class="text-black" size="xs" />
                    <p class="body-xs italic py-1">{{ getConvoMessagePoV(message, user?.id!) }}</p>
                  </div>
                </template>
              </UChatMessage>
            </UChatMessages>
          </div>
        </template>
        <template #footer>
          <UInput
            :ui="{
              root: 'body-sm w-full',
              base: 'bg-background/50! outline-0!',
              trailingIcon: 'text-secondary',
            }"
            placeholder="Type your message..."
            trailing
            variant="none"
            v-model="messageContent"
            autofocus
            @keydown.enter.prevent="handleSendMessage"
          >
            <template #trailing>
              <UButton
                icon="i-lucide-send"
                variant="ghost"
                size="sm"
                :disabled="messageContent.trim().length === 0"
                @click="handleSendMessage"
                :ui="{
                  leadingIcon: 'text-secondary',
                }"
              />
            </template>
          </UInput>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Enquiries",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

const { allConversations, sendReply } = useConversations();
const { user } = useUserSession();
const open = ref(false);
const messageContent = ref("");
const chatContainer = ref<HTMLElement | null>(null);

const selectedConversation = ref<ConversationWithUserAndMessages>({} as ConversationWithUserAndMessages);

const breakpoints = useBreakpoints(breakpointsTailwind);
const activeBreakpoints = breakpoints.active();

const isMobile = computed(() => {
  return !activeBreakpoints.value.includes("md") && !activeBreakpoints.value.includes("lg") && !activeBreakpoints.value.includes("xl") && !activeBreakpoints.value.includes("2xl");
});

// Helper functions for card data
function getOtherUser(conversation: ConversationWithUserAndMessages) {
  const currentUserId = user.value?.id;
  if (!currentUserId) return { username: null, email: 'Unknown User' };
  
  // If current user is the sender, show the receiver
  if (conversation.sender?.id === currentUserId) {
    return conversation.receiver || { username: null, email: 'Unknown User' };
  }
  // Otherwise show the sender
  return conversation.sender || { username: null, email: 'Unknown User' };
}

function getUnreadCount(conversation: ConversationWithUserAndMessages): number {
  return conversation.messages?.filter(
    (message) => !message.isRead && message.receiverId === user.value?.id
  ).length || 0;
}

function isLastMessageFromUser(conversation: ConversationWithUserAndMessages): boolean {
  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
  return lastMessage?.senderId === user.value?.id;
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount || isNaN(amount)) return 'Price N/A';
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function openModal(conversation: ConversationWithUserAndMessages) {
  open.value = !open.value;
  selectedConversation.value = conversation;
  scrollToBottom();
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

async function handleSendMessage() {
  if (!messageContent.value.trim() || !selectedConversation.value.id) return;

  try {
    await sendReply(selectedConversation.value.id, messageContent.value);
    messageContent.value = "";
    console.log("Message sent");
  } catch (e) {
    console.error("Failed to send message", e);
  }
}

const messages: ComputedRef<MessageWithUser[]> = computed(() => {
  return selectedConversation.value.messages || [];
});

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);
</script>
