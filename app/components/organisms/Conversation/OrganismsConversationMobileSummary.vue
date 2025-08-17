<template>
  <div class="mobile-chat-page">
    <div class="mobile-chat-header">
      <h3 class="chat-title">Conversations</h3>
    </div>
      <div class="chat-summary-container" v-if="!activeConversation">
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
// No props needed for mobile page variant

const { user } = useUserSession()
const activeConversation = ref<ConversationWithUserAndMessages | null>(null)

// No scroll lock needed for mobile page variant

function handleSelectConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation
}
</script>

<style lang="scss" scoped>
.mobile-chat-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--background-200);
  overflow: hidden;
}


.mobile-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-20) var(--size-16);
  border-bottom: 1px solid var(--border-100);
  // flex-shrink: 0;
}

.chat-summary-container {
  flex: 1 1 auto;
  min-height: 0;
  height: calc(100vh - var(--header-offset) - var(--mobile-nav-height) - 100px);
}

.chat-title {
  margin: 0;
  color: var(--foreground-100);
  font-size: 1.25rem;
  font-weight: 600;
}


</style>