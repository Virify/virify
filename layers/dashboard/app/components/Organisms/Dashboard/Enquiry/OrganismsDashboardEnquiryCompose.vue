<template>
  <div class="flex flex-col">
    <!-- Hint + suggestion chips -->
    <div class="px-4 py-5 lg:py-12 flex flex-col gap-3">
      <p class="body-sm">Here are some suggestions to help you start your enquiry or you can type your own message below:</p>
      <div class="flex flex-wrap gap-4">
        <UBadge
          v-for="s in SUGGESTIONS"
          :key="s.label"
          :label="s.label"
          class="cursor-pointer body-sm"
          variant="solid"
          icon="i-lucide-pen-line"
          :color="composeMessage === s.message ? 'primary' : 'secondary'"
          @click="composeMessage = s.message"
        />
      </div>
    </div>
    <!-- Input row — sits at the bottom, visually mirrors the chat footer -->
    <div class="flex items-start gap-1 sm:px-2 px-2 border-t border-default min-h-13.5 pt-2">
      <UPopover v-model:open="emojiOpen" :ui="{ content: 'p-0 overflow-hidden' }">
        <UButton
          icon="i-lucide-smile"
          variant="ghost"
          size="sm"
          :disabled="sending"
          :ui="{ leadingIcon: 'text-(--foreground-200)' }"
        />
        <template #content>
          <ClientOnly>
            <AtomsEmojiPicker @emoji-select="onEmojiSelect" />
          </ClientOnly>
        </template>
      </UPopover>
      <UTextarea
        :ui="{
          root: 'body-sm flex-1',
          base: 'bg-background/50! outline-0! p-0! resize-none!',
        }"
        placeholder="Type your message..."
        variant="none"
        v-model="composeMessage"
        autofocus
        autoresize
        :rows="1"
        :maxrows="6"
        :disabled="sending"
        @keydown.enter.exact.prevent="handleSubmit"
      />
      <UButton
        icon="i-lucide-send"
        variant="ghost"
        size="sm"
        :loading="sending"
        :disabled="sending || !composeMessage.trim()"
        :ui="{ leadingIcon: 'text-secondary' }"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  newEnquiryData: { listingId: number; receiverId: number; listingTitle?: string };
}>();

const SUGGESTIONS = [
  {
    label: 'Arrange a viewing',
    message: "Hi, I found your property on Virify and I'd love to arrange a viewing. When would be convenient?",
  },
  {
    label: 'Is it still available?',
    message: "Hi, I'm interested in your property — is it still available? I'm looking to move soon.",
  },
  {
    label: 'Rental terms',
    message: "Hi, could you share more details about the rental terms, including the deposit and contract length?",
  },
  {
    label: 'More photos or video',
    message: "Hi, I'm very interested. Would it be possible to see more photos or a video tour of the property?",
  },
  {
    label: 'Pet-friendly?',
    message: "Hi, I love this property! I have a pet — would you consider a tenant with a pet?",
  },
  {
    label: 'Ready to move quickly',
    message: "Hi, I'm very interested and can move quickly if this is a good fit. Can we arrange a call or viewing?",
  },
] as const;

const { modalConversation, newEnquiryData: sharedNewEnquiryData, closeConversation } = useGlobalEnquiryModal();
const { startConversation, hasContactedListing, openEnquiry } = useEnquiries();
const toast = useToast();

const composeMessage = ref('');
const sending = ref(false);
const emojiOpen = ref(false);

function onEmojiSelect(emoji: string) {
  composeMessage.value += emoji;
  emojiOpen.value = false;
}

async function handleSubmit() {
  if (!composeMessage.value.trim()) return;

  if (hasContactedListing(props.newEnquiryData.listingId)) {
    toast.add({
      title: 'Already Contacted',
      description: 'You have already started a conversation for this listing.',
      icon: 'i-lucide-circle-x',
      color: 'error',
    });
    closeConversation();
    return;
  }

  sending.value = true;
  try {
    const conversation = await startConversation(
      props.newEnquiryData.listingId,
      props.newEnquiryData.receiverId,
      composeMessage.value.trim(),
    );

    if (conversation) {
      composeMessage.value = '';
      sharedNewEnquiryData.value = null;
      openEnquiry(conversation);
      modalConversation.value = conversation;
    } else {
      toast.add({
        title: 'Already Contacted',
        description: 'You have already started a conversation for this listing.',
        icon: 'i-lucide-circle-x',
        color: 'error',
      });
      closeConversation();
    }
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to send message. Please try again.',
      icon: 'i-lucide-circle-x',
      color: 'error',
    });
  } finally {
    sending.value = false;
  }
}
</script>
