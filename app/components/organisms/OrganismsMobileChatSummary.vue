<template>
  <!-- Mobile Chat Summary Overlay -->
  <div class="mobile-chat-overlay" :class="{ 'open': isOpen }" @click="$emit('close')">
    <aside class="mobile-chat-summary" @click.stop>
      <div class="mobile-chat-header">
        <h3 class="chat-title">Enquiries</h3>
        <button class="close-btn" @click="$emit('close')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>
      <div class="chat-summary-scrollable">
        <OrganismsChatSummary :limit="0" :search-enabled="true" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<style lang="scss" scoped>
.mobile-chat-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  height: 100%;
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
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--size-20) var(--size-20) var(--size-16);
  border-bottom: 1px solid var(--border-100);
  background: var(--background-200);
}

.chat-summary-scrollable {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: var(--size-20);
  padding-bottom: 150px;
  min-height: 0;
  height: 0;
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