<template>
  <div class="mobile-chat-overlay" :class="{ 'open': isOpen }" @click="$emit('close')">
    <aside class="mobile-chat-summary" @click.stop>
      <div class="mobile-chat-header">
        <h3 class="chat-title">Conversations</h3>
        <button class="close-btn" @click="$emit('close')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>
      <div class="chat-summary-scrollable" v-if="!activeConversation">
        <OrganismsConversationSummary :limit="0" :search-enabled="true" :disable-navigate="true" :sort="true" @select-conversation="handleSelectConversation" />
      </div>
      <OrganismsConversationActive
        :is-open="!!activeConversation"
        :conversation="activeConversation"
        :current-user-id="user?.id"
        @back="activeConversation = null"
      />
    </aside>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const { user } = useUserSession()
const activeConversation = ref<ConversationWithUserAndMessages | null>(null)

watchEffect(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = props.isOpen ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = ''
  }
})

function handleSelectConversation(conversation: ConversationWithUserAndMessages) {
  activeConversation.value = conversation
}
</script>

<style lang="scss" scoped>
.mobile-chat-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }

  &.open {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-chat-summary {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: calc(100dvh - var(--mobile-nav-header-height));

  background: var(--background-200);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  .open & {
    transform: translateX(0);
  }
}

.mobile-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-20) var(--size-16);
  border-bottom: 1px solid var(--border-100);
}

.chat-summary-scrollable {
  /* allow the chat list to grow and scroll internally without forcing a zero height or an always-visible scrollbar */
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  height: calc(100dvh - var(--mobile-nav-header-height));
}

.chat-title {
  margin: 0;
  color: var(--foreground-100);
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--foreground-100);
  cursor: pointer;
  padding: var(--size-8);
  border-radius: var(--border-radius-md);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--background-300);
  }

  :deep(svg) {
    display: block;
  }
}

</style>