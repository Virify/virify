<template>
  <div class="sidebar-content sidebar-content--conversations" :class="{ 'sidebar-content--collapsed': isCollapsed, 'sidebar-content--has-overlay': selectedConversation !== null }">
    <OrganismsConversationSummary 
      v-show="selectedConversation === null"
      :is-open="true"
      :limit="0" 
      :search-enabled="true" 
      :disable-navigate="true"
      :sort="true"
      @select-conversation="handleConversationSelect"
      @toggle-collapsed="isCollapsed = $event"
    />
    
    <div v-show="selectedConversation !== null" class="sidebar-overlay">
      <OrganismsConversationActive 
        :is-open="selectedConversation !== null"
        :conversation="selectedConversation"
        :current-user-id="user?.id"
        @back="selectedConversation = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession()
const selectedConversation = ref<ConversationWithUserAndMessages | null>(null)
const isCollapsed = ref(false)

function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  selectedConversation.value = conversation
}
</script>