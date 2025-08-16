<template>
  <div class="m-listing-card-actions" role="group" aria-label="Property actions">
    <nuxt-link :to="`/listing/${listingId}`" class="| button button-primary body-sm"
      aria-label="View property details" title="View property details">
      View
    </nuxt-link>
    <button class="| button button-ghost body-sm" :disabled="conversationState.isDisabled" @click="onContact" 
        :aria-label="conversationState.isDisabled ? 'Cannot contact about this property' : 'Contact about this property'"
        :title="conversationState.isDisabled ? 'Cannot contact about this property' : 'Contact about this property'">
      {{ conversationState.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number;
  userId: number;
}
const props = defineProps<Props>();

const { getConversationState, handleConversationClick } = useConversations();

const conversationState = computed(() => getConversationState(props.listingId, props.userId));

function onContact() {
  handleConversationClick(props.listingId, props.userId);
}
</script>
<style lang="scss">
.m-listing-card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-8);
  width: 100%;

  .button {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    border-color: var(--secondary-400);
  }
}
</style>
