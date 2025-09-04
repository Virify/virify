<template>
  <div class="o-listing-buttons" role="presentation">
    <AtomsNoteButton class="o-listing-buttons__fav | button button-ghost" :listing-id="listingId" />
    <AtomsFavouriteButton class="o-listing-buttons__fav | button button-ghost" :listing-id="listingId" />

    <button 
      class="o-listing-buttons__contact | button button-secondary button-full"
      :disabled="conversationState.isDisabled"
      @click="() => handleConversationClick(listingId, agent?.id)"
    >
      {{ conversationState.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number
  agent?: {
    username?: string | null
    email?: string | null
    id?: number | null
    createdAt?: Date | String | null
    avatar?: string | null
  }
}

const props = defineProps<Props>()

const { getConversationState, handleConversationClick } = useConversations()

const conversationState = computed(() => getConversationState(props.listingId, props.agent?.id))
</script>

<style lang="scss">
.o-listing-buttons {
  display: flex;
  align-items: center;
  gap: var(--size-8);

  &__contact {
    white-space: nowrap;
    padding-inline: var(--size-32);
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
    flex-shrink: 0;
    min-width: var(--size-24);
    min-height: var(--size-24);
  }
}
</style>