<template>
  <UChatMessage
    :variant="isMessageFromUser(message, currentUserId) ? 'soft' : 'subtle'"
    :key="message.id"
    :side="isMessageFromUser(message, currentUserId) ? 'left' : 'right'"
    role="user"
    :parts="[{ text: message.content ?? '' }]"
    :id="String(message.id)"
    :ui="{
      container: 'pb-0',
      content:
        'min-w-[8rem] ' +
        (isMessageFromUser(message, currentUserId)
          ? 'bg-secondary/90 text-(--monochrome-900)/70'
          : 'bg-primary/100 text-(--monochrome-600)'),
    }"
  >
    <template #content>
      <p
        v-if="message.content"
        :class="['body-sm break-words whitespace-pre-wrap', 'text-(--monochrome-900)']"
      >
        {{ message.content }}
      </p>
      <!-- Attached media -->
      <div v-if="message.userMedia" class="mt-1">
        <a
          v-if="message.userMedia.mediaType === 'IMAGE'"
          :href="getFileUrl(message.userMedia.key)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="getFileUrl(message.userMedia.key)"
            :alt="message.userMedia.originalName"
            class="max-h-48 max-w-full rounded-md object-contain"
          />
        </a>
        <a
          v-else
          :href="getFileUrl(message.userMedia.key)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 body-xs underline"
        >
          <UIcon
            :name="
              message.userMedia.mediaType === 'PDF'
                ? 'i-lucide-file-text'
                : message.userMedia.mediaType === 'SPREADSHEET'
                  ? 'i-lucide-table'
                  : 'i-lucide-file'
            "
            class="size-4 shrink-0"
          />
          {{ message.userMedia.originalName }}
        </a>
      </div>
      <!-- Avatar + sender + timestamp on one compact row -->
      <div class="flex items-center gap-1 mt-1 flex-wrap">
        <UAvatar
          :src="message.sender.avatar || undefined"
          :alt="message.sender.username!"
          class="text-(--foreground-100)"
          :ui="{
            root: message.sender.avatar ? 'bg-transparent' : 'bg-(--background-200)',
          }"
          size="2xs"
        />
        <p class="body-xs italic">{{ getConvoMessagePoV(message, currentUserId) }}</p>
        <p class="body-xs italic ml-auto">{{ formatMessageTimestamp(message.createdAt) }}</p>
        <UIcon
          v-if="!isMessageFromUser(message, currentUserId)"
          :name="message.isRead ? 'i-lucide-check-check' : 'i-lucide-check'"
          class="size-3 shrink-0"
          :class="message.isRead ? 'text-secondary' : 'opacity-60'"
        />
      </div>
    </template>
  </UChatMessage>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: any;
  currentUserId: number;
}>();

const { getFileUrl } = useCloudflareR2();
</script>
