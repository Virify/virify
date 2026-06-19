<template>
  <UModal
    v-model:open="isOpen"
    :fullscreen="isMobile"
    :style="
      isMobile ?
        {
          height: 'var(--rv-height, 100%)',
          top: 'var(--rv-offset, 0px)',
          'max-height': 'none',
        }
      : undefined
    "
    :ui="modalUi"
  >
    <template #title>
      <!-- Compose mode header -->
      <span
        v-if="isComposeMode"
        class="title-sm"
      >
        {{
          newEnquiryData?.listingTitle ?
            `Enquire about ${newEnquiryData.listingTitle}`
          : "Start your enquiry"
        }}
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
        :listing-id="conversation?.listing?.id ?? null"
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
      <div
        v-else
        ref="chatContainer"
        class="overflow-y-auto px-4 scroll-smooth"
        :class="isMobile ? 'h-full' : 'h-[60vh]'"
      >
        <UChatMessages should-auto-scroll>
          <OrganismsDashboardEnquiryChatMessage
            v-for="message in localMessages"
            :key="message.id"
            :message="message"
            :current-user-id="user?.id!"
          />
        </UChatMessages>
      </div>
      <!-- Typing indicator -->
      <Transition name="fade">
        <div
          v-if="typingUserId"
          class="px-4 pb-2 body-xs text-(--foreground-200) flex items-center gap-1.5"
        >
          <span class="flex gap-0.5">
            <span
              class="inline-block w-1 h-1 rounded-full bg-(--foreground-200) animate-bounce [animation-delay:0ms]"
            ></span>
            <span
              class="inline-block w-1 h-1 rounded-full bg-(--foreground-200) animate-bounce [animation-delay:150ms]"
            ></span>
            <span
              class="inline-block w-1 h-1 rounded-full bg-(--foreground-200) animate-bounce [animation-delay:300ms]"
            ></span>
          </span>
          {{ otherUser?.username ?? "The other person" }} is typing...
        </div>
      </Transition>
    </template>
    <template
      v-if="!isComposeMode"
      #footer
    >
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
    newEnquiryData?: {
      listingId: number;
      receiverId: number;
      listingType: "sale" | "rent";
      listingTitle?: string;
    } | null;
  }>();

  const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
  }>();

  const isOpen = usePropModel(props, "open", emit);

  // Constrain fullscreen modal to the visual viewport so the input isn't
  // covered when the on-screen keyboard opens (interactive-widget=overlays-content).
  useDynamicViewportHeight();

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
    typingUserId,
    handleSendMessage,
    handleFileChange,
    removePendingMedia,
    handleEnquiryAvailabilityChange,
  } = useEnquiryModal(props, emit);

  const isComposeMode = computed(() => !!props.newEnquiryData && !props.conversation);

  const modalUi = computed(() => ({
    overlay: "bg-black/50 backdrop-blur-sm",
    content: "max-w-[1300px] w-full sm:w-[90vw]",
    header: "w-full justify-between",
    title: "flex-1 min-w-0 overflow-hidden",
    description: "pl-10 body-sm",
    body: isComposeMode.value ? "p-0!" : "py-6 px-0!",
  }));
</script>
