<template>
  <div class="flex flex-col gap-3 p-3 rounded-lg bg-elevated">
    <div class="flex items-start gap-2 flex-1">
      <UIcon 
        :name="!isLastMessageFromCurrentUser(enquiry, user?.id) ? 'i-lucide-corner-down-right' : 'i-lucide-corner-down-left'" 
        class="w-4 h-4 mt-0.5 shrink-0"
        :class="!isLastMessageFromCurrentUser(enquiry, user?.id) ? 'text-secondary' : 'text-gray-400'"
      />
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          {{ isLastMessageFromCurrentUser(enquiry, user?.id) ? 'You' : (getConversationOtherUser(enquiry, user?.id).username || formatPartnerName(getConversationOtherUser(enquiry, user?.id).email || 'Them')) }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
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
// Assuming utils are auto-imported. If not, we might need imports.
// isLastMessageFromCurrentUser, getConversationOtherUser, formatPartnerName, getLastMessageContent, getUnreadCount
const props = defineProps<{
  enquiry: any,
  user: any
}>()

const unreadCount = computed(() => getUnreadCount(props.enquiry, props.user?.id));

defineEmits(['reply'])
</script>