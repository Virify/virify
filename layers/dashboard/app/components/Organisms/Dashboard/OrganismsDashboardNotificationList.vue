<template>
  <div v-if="messages.length === 0" class="flex flex-col items-center justify-center p-8 text-center">
    <UIcon name="i-lucide-bell-off" class="w-8 h-8 mb-2 opacity-50" />
    <p class="text-sm">No new notifications</p>
  </div>
  <div v-else class="space-y-0">
    <UCard
      v-for="msg in messages"
      :key="msg.id"
      @click="$emit('select', msg.conversationId)"
      :ui="{
        root: 'cursor-pointer transition-colors rounded-0! hover:bg-elevated/80 m-3 bg-elevated',
        header: 'flex items-center justify-between sm:p-2 p-2 gap-2 body-sm font-bold',
        body: 'flex items-center justify-start gap-2 border-0 sm:p-2 p-2 text-sm',
        footer: 'sm:p-2 p-2 sm:pt-1 pt-1',
      }"
    >
      <template #header>
        <h3>New Message!</h3>
        <UButton
          size="sm"
          variant="ghost"
          color="primary"
          class=""
          icon="i-lucide-x"
          @click.stop="handleMarkAsRead(msg.id, msg.conversationId)"
        />
      </template>
      <template #default>
        <UAvatar
          :src="msg.sender?.avatar || undefined"
          :alt="msg.sender?.username || 'User'"
          size="sm"
          :ui="{
            root: 'border border-(--foreground-100)',
          }"
        />
        <p class="font-bold truncate mt-0.5!">
          {{ msg.sender?.username || "Unknown" }}
        </p>
      </template>
      <template #footer>
        <p class="text-xs line-clamp-3">
          {{ msg.content }}
        </p>
        <div class="flex justify-between items-center pt-2">
          <UTooltip text="Report message">
            <UButton
              size="md"
              variant="ghost"
              icon="i-lucide-triangle-alert"
              to="/support"
              target="_blank"
              @click.stop
              :ui="{
                leadingIcon: 'text-error'
              }"
            />
          </UTooltip>
          <p class="text-xs italic font-light flex-1 text-right pt-3">
          {{ formatMessageTimestamp(msg.createdAt) }}
          </p>
        </div>
        
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  messages: MessageWithUser[];
}>();

defineEmits<{
  (e: "select", conversationId: number): void;
}>();

const { markMessageAsRead } = useConversations();
const { removeReadMessage } = useNotifications();

const handleMarkAsRead = async (messageId: number, conversationId: number) => {
  await markMessageAsRead(messageId, conversationId);
  removeReadMessage(messageId);
}
</script>
