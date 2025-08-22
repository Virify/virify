<template>
  <div class="mobile-chat">
    <div class="mobile-chat-header">
      <h3 class="chat-title">Conversations</h3>
    </div>
      <div v-if="!activeConversation">
        <OrganismsConversationSummary :limit="0" :search-enabled="true" :disable-navigate="true" :sort="true" @select-conversation="handleSelectConversation" />
      </div>
  <OrganismsConversationActive
        :is-open="!!activeConversation"
        :conversation="activeConversation"
        :current-user-id="user?.id"
        @back="activeConversation = null"
      />
  </div>
</template>

<script setup lang="ts">

const { user } = useUserSession()
const activeConversation = ref<ConversationWithUserAndMessages | null>(null)

// No scroll lock needed for mobile page variant

function handleSelectConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation
}
</script>

<style lang="scss" scoped>
.mobile-chat {
  width: 100%;
  overflow: visible;
  background: var(--background-200);
}

.mobile-chat-header {
  position: sticky;
  top: var(--header-offset, 0);
  background: var(--background-200);
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-20) var(--size-16);
}

.chat-title {
  margin: 0;
  color: var(--foreground-100);
  font-size: 1.25rem;
  font-weight: 600;
}
</style>