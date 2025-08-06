<template>
  <div role="presentation" class="m-card-slots-footer">
    <p class="m-card-slots-footer__author-block | body-xs font-semibold">
      <AtomsIcon icon="cards/verified" />

      <span class="m-card-slots-footer__author">
        Sold by {{ username }}
      </span>
    </p>

    <div class="m-card-slots-footer__bookmarks">
      <AtomsNoteButton :listing-id="propertyId" />
      <AtomsFavouriteButton :listing-id="propertyId" :confirm-removal="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  propertyId: number,
  user: Record<string, unknown>
}

const props = defineProps<Props>()

/**
 *  Get username from props
 */
const username = computed(() => {
  const { username } = asObject(props.user)

  return username
})

</script>

<style lang="scss">
.m-card-slots-footer {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin: var(--size-10) 0;

  &__author-block {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-6);
    overflow: hidden;
    padding: var(--size-8) var(--size-16) var(--size-8) var(--size-12);
    background: var(--card-background-pill);
    border: 1px solid var(--card-border-colour);
    border-radius: var(--border-radius-xl);
    width: 100%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;

    .a-icon {
      width: var(--size-20);
      height: var(--size-20);
      flex-shrink: 0;
    }
  }

  &__author {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__bookmarks {
    display: flex;
    align-items: center;
    gap: var(--size-10);
    padding: var(--size-10) var(--size-12);
    background: var(--card-background-pill);
    border: 1px solid var(--card-border-colour);
    border-radius: var(--border-radius-xl);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    .a-favourite-button,
    .a-note-button {
      display: flex;
      align-items: center;
    }

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }
  }
}
</style>