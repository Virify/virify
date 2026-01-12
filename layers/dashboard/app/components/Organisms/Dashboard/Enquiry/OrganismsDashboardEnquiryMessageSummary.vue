<template>
  <div class="flex flex-col gap-3 p-4 bg-(--background-200)">
    <div class="flex items-start gap-2 flex-1">
      <UIcon 
        :name="!isLastMessageFromCurrentUser(enquiry, user?.id) ? 'i-lucide-corner-down-right' : 'i-lucide-corner-down-left'" 
        class="w-4 h-4 mt-0.5 shrink-0"
        :class="!isLastMessageFromCurrentUser(enquiry, user?.id) ? 'text-secondary' : 'text-gray-400'"
      />
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold text-secondary mb-1">
          {{ isLastMessageFromCurrentUser(enquiry, user?.id) ? 'You' : (getConversationOtherUser(enquiry, user?.id).username || formatPartnerName(getConversationOtherUser(enquiry, user?.id).email || 'Them')) }}
        </p>
        <p class="text-sm text-(--foreground-100) line-clamp-3 break-all">
          {{ getLastMessageContent(enquiry) }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between gap-2 mt-auto">
      <div class="flex items-center gap-2">
        <UIcon 
          :name="unreadCount > 0 ? 'i-lucide-mail' : 'i-lucide-mail-open'" 
          class="w-4 h-4"
          :class="unreadCount > 0 ? 'text-secondary' : 'text-gray-400'"
        />
        <span class="text-xs text-gray-600 dark:text-gray-400">
          {{ unreadCount > 0 ? `${unreadCount} unread` : 'All read' }}
        </span>
      </div>
      <UButton
        icon="i-lucide-reply"
        size="xs"
        variant="solid"
        color="secondary"
        class="body-xs text-white!"
        @click.stop="$emit('reply', enquiry)"
      >
        Reply
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { User } from '#auth-utils'

  const props = defineProps<{
    enquiry: ConversationWithUserAndMessages,
    user: User | null,
  }>()

  const unreadCount = computed(() => getUnreadCount(props.enquiry, props.user?.id));

  defineEmits(['reply'])
</script>