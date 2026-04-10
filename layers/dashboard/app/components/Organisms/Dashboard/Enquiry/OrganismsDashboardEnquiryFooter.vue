<template>
  <!-- Pending media preview -->
  <Transition name="fade">
    <div
      v-if="pendingMedia"
      class="flex items-center gap-2 px-4 pb-2 border-t border-(--background-300) pt-2"
    >
      <div
        class="relative flex items-center gap-2 bg-(--background-200) rounded-md px-2 py-1 max-w-full"
      >
        <img
          v-if="pendingMedia.mediaType === 'IMAGE'"
          :src="getFileUrl(pendingMedia.key)"
          class="h-10 w-10 rounded object-cover shrink-0"
          :alt="pendingMedia.originalName"
        />
        <UIcon
          v-else
          :name="
            pendingMedia.mediaType === 'PDF'
              ? 'i-lucide-file-text'
              : pendingMedia.mediaType === 'SPREADSHEET'
                ? 'i-lucide-table'
                : 'i-lucide-file'
          "
          class="size-5 shrink-0 text-secondary"
        />
        <span class="body-xs truncate max-w-40">{{ pendingMedia.originalName }}</span>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          size="xs"
          color="error"
          :loading="isDeletingMedia"
          @click="$emit('removePendingMedia')"
        />
      </div>
    </div>
  </Transition>

  <!-- Upload progress -->
  <div v-if="isUploading" class="flex items-center gap-2 px-4 pb-2">
    <UIcon name="i-lucide-loader-circle" class="animate-spin size-4 text-secondary" />
    <span class="body-xs text-(--foreground-200)">Uploading...</span>
  </div>

  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:px-2 w-full">
    <!-- Icon buttons: own row on mobile, inline on sm+ -->
    <div class="flex items-center gap-1 sm:contents">
      <!-- Request viewing button -->
      <OrganismsDashboardEnquiryViewingPopover
        v-if="conversation?.listing"
        :conversation="conversation"
        :is-owner="isOwner"
      />

      <!-- File attachment -->
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="$emit('fileChange', $event)"
      />
      <UButton
        icon="i-lucide-paperclip"
        variant="ghost"
        size="sm"
        :disabled="!!pendingMedia || isUploading"
        :ui="{ leadingIcon: 'text-(--foreground-200)' }"
        @click="fileInputRef?.click()"
      />

      <!-- Emoji picker -->
      <UPopover v-model:open="emojiPickerOpen" :ui="{ content: 'p-0 overflow-hidden' }">
        <UButton
          icon="i-lucide-smile"
          variant="ghost"
          size="sm"
          :ui="{ leadingIcon: 'text-(--foreground-200)' }"
        />
        <template #content>
          <ClientOnly>
            <AtomsEmojiPicker @emoji-select="onEmojiSelect" />
          </ClientOnly>
        </template>
      </UPopover>
    </div>

    <!-- Message input -->
    <UInput
      :ui="{
        root: 'body-sm flex-1',
        base: 'bg-background/50! outline-0! p-0!',
        trailingIcon: 'text-secondary p-0',
        trailing: 'p-0',
      }"
      placeholder="Type your message..."
      trailing
      variant="none"
      v-model="messageContent"
      autofocus
      @keydown.enter.prevent="$emit('send')"
    >
      <template #trailing>
        <UButton
          icon="i-lucide-send"
          variant="ghost"
          size="sm"
          :disabled="messageContent.trim().length === 0 && !pendingMedia"
          :ui="{ leadingIcon: 'text-secondary' }"
          @click="$emit('send')"
        />
      </template>
    </UInput>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  conversation: ConversationWithMinimalListing | null;
  isOwner: boolean;
  pendingMedia: UserMediaRecord | null;
  isDeletingMedia: boolean;
  isUploading: boolean;
}>();

const emit = defineEmits<{
  send: [];
  fileChange: [event: Event];
  removePendingMedia: [];
}>();

const messageContent = defineModel<string>("messageContent", { required: true });

const { getFileUrl } = useCloudflareR2();
const fileInputRef = ref<HTMLInputElement | null>(null);
const emojiPickerOpen = ref(false);

function onEmojiSelect(emoji: string) {
  messageContent.value += emoji;
  emojiPickerOpen.value = false;
}
</script>
