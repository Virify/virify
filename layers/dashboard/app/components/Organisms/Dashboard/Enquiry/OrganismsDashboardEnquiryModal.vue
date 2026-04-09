<template>
  <UModal
    v-model:open="isOpen"
    :fullscreen="isMobile"
    :ui="modalUi"
  >
    <template #title>
      <!-- Compose mode header -->
      <span v-if="isComposeMode" class="title-sm">
        {{ newEnquiryData?.listingTitle ? `Enquire about ${newEnquiryData.listingTitle}` : 'New Enquiry' }}
      </span>
      <!-- Chat mode header -->
      <OrganismsDashboardEnquiryChatHeader
        v-else
        :other-user="otherUser"
        :sub-title="subTitle"
        :is-owner="isOwner"
        :availability-status="enquiryAvailabilityStatus"
        :availability-items="enquiryAvailabilityItems"
        :is-updating="isUpdatingEnquiryStatus"
        @availability-change="handleEnquiryAvailabilityChange"
      />
    </template>
    <template #body>
      <!-- Compose mode -->
      <OrganismsDashboardEnquiryCompose
        v-if="isComposeMode && newEnquiryData"
        :new-enquiry-data="newEnquiryData"
      />
      <!-- Chat mode body -->
      <div v-else ref="chatContainer" class="overflow-y-auto px-4 scroll-smooth" :class="isMobile ? 'h-full' : 'h-[60vh]'">
        <UChatMessages should-auto-scroll>
          <OrganismsDashboardEnquiryChatMessage
            v-for="message in localMessages"
            :key="message.id"
            :message="message"
            :current-user-id="user?.id!"
          />
        </UChatMessages>
      </div>
    </template>
    <template v-if="!isComposeMode" #footer>
      <OrganismsDashboardEnquiryFooter
        :conversation="conversation"
        :is-owner="isOwner"
        :pending-media="pendingMedia"
        :is-deleting-media="isDeletingMedia"
        :is-uploading="isUploading"
        v-model:message-content="messageContent"
        @send="handleSendMessage"
        @file-change="handleFileChange"
        @remove-pending-media="removePendingMedia"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";

const props = defineProps<{
  open: boolean;
  conversation: ConversationWithMinimalListing | null;
  user: User | null;
  newEnquiryData?: { listingId: number; receiverId: number; listingTitle?: string } | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const isOpen = usePropModel(props, "open", emit);

const {
  messageContent,
  chatContainer,
  localMessages,
  isUpdatingEnquiryStatus,
  pendingMedia,
  isDeletingMedia,
  isUploading,
  enquiryAvailabilityStatus,
  isOwner,
  isMobile,
  otherUser,
  subTitle,
  enquiryAvailabilityItems,
  handleSendMessage,
  handleFileChange,
  removePendingMedia,
  handleEnquiryAvailabilityChange,
} = useEnquiryModal(props, emit);

const isComposeMode = computed(() => !!props.newEnquiryData && !props.conversation);

const modalUi = computed(() => ({
  overlay: 'bg-black/50 backdrop-blur-sm',
  content: 'max-w-[1300px] w-full sm:w-[90vw]',
  header: 'w-full justify-between',
  title: 'flex-1 min-w-0 overflow-hidden',
  description: 'pl-10 body-sm',
  body: isComposeMode.value ? 'p-0!' : 'py-6 px-0!',
}));
</script>


