<template>
  <div class="o-listing-buttons" role="presentation">
    <AtomsNoteButton class="| button button-square button-ghost" :listing-id="listingId" />
    <AtomsFavouriteButton class="| button button-square button-ghost" :listing-id="listingId" />

    <nuxt-link :to="enquireUrl" class="o-listing-buttons__enquire | button button-secondary button-full">
      Enquire now
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number
  enquireUrl: string
}

defineProps<Props>()
</script>

<style lang="scss">
.o-listing-buttons {
  display: flex;
  align-items: center;
  gap: var(--size-8);

  &__enquire {
    white-space: nowrap;
    padding-inline: var(--size-32);
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>