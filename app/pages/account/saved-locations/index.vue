<template>
  <div class="saved-locations-page">
    <MoleculesAccountHeader :title="'My Favourite Locations'" />

    <div class="saved-locations-page__grid">
      <AtomsAccountCardContainer>
        <template v-if="entries?.length">
          <ul class="saved-locations-list">
            <li v-for="entry in entries" :key="entry.id" class="saved-locations-list__item">
              <div class="saved-locations-list__icon">
                <AtomsIcon icon="search/pin" />
              </div>
              <p class="saved-locations-list__name | body-sm">{{ entry.name }}</p>
              <div class="saved-locations-list__actions">
                <button class="button button-xs button-tertiary" @click="openEditDialog(entry)">Edit</button>
              </div>
              <p class="saved-locations-list__address | body-xs faded-text">{{ entry.location }}</p>
            </li>
          </ul>
        </template>
        <p v-else class="saved-locations-card__empty | body-sm">No saved locations yet.</p>
      </AtomsAccountCardContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["authenticated"], layout: "account" });

useSeoMeta({
  title: "Saved Locations - Virify",
  description: "Manage your saved search locations",
});

const { entries, getEntries } = useSavedLocation();
const { showDialog } = useDialog();

// Dialog components
import ViewsDialogSavedLocationSingle from "@/components/views/Dialog/ViewsDialogSavedLocationSingle.vue";

onMounted(() => {
  getEntries();
});

function openEditDialog(entry?: any) {
  showDialog({ component: ViewsDialogSavedLocationSingle, props: { entry } });
}
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

// BEM + nested styling
.saved-locations-page {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  max-height: calc(100dvh - var(--header-height) - var(--size-32));

  @include mq.mobile-only {
    height: 100%;
    max-height: unset;
  }

  &__header {
    background: var(--background-100);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: var(--size-24);
  }

  &__title {
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-16);
    overflow: hidden;

    @include mq.not-notebook {
      grid-template-columns: 1fr;
      gap: var(--size-12);
      height: auto;
      overflow: visible;
    }
  }
}

.saved-locations-list {
  list-style: none;
  margin: 0;
  padding: var(--size-16);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-12);
  overflow: hidden;

  @include mq.tablet {
    grid-template-columns: 1fr 1fr;
  }

  &__item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      'icon name actions'
      'icon address address';
    column-gap: var(--size-12);
    align-items: start;
    background: var(--background-100);
    border: 1px solid var(--border-color-200);
    border-radius: var(--border-radius-xl);
    padding: var(--size-16);
  }

  &__icon {
    grid-area: icon;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-40);
    height: var(--size-40);
    border-radius: var(--border-radius-lg);
    background: var(--background-100);
    color: var(--foreground-100);
  }

  &__name {
    grid-area: name;
    margin: 0;
    font-weight: 600;
    align-self: center;
  }

  &__address {
    grid-area: address;
    margin: 0;
    line-height: var(--lineheight-sm);
  }

  &__actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    gap: var(--size-8);
    align-self: center;
  }
}
</style>
