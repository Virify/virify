<template>
  <section
    v-if="description"
    class="listing-general-info"
  >
    <h3 class="listing-general-info__title | title-md">Property Description</h3>
    <div
      class="listing-general-info__body"
      :class="{ 'listing-general-info__body--collapsed': !expanded }"
    >
      <p
        v-for="(paragraph, i) in paragraphs"
        :key="i"
        class="listing-general-info__description | r-body-md-sm"
      >
        {{ paragraph }}
      </p>
    </div>
    <button
      v-if="paragraphs.length > 1 || (description && description.length > 300)"
      class="listing-general-info__toggle | body-sm"
      @click="expanded = !expanded"
    >
      {{ expanded ? "Show less" : "Read more" }}
    </button>
  </section>
</template>

<script setup lang="ts">
  interface Props {
    description?: string;
  }

  const props = defineProps<Props>();

  const expanded = ref(false);

  const paragraphs = computed(() =>
    (props.description ?? "").split(/\n\n+/).filter((p) => p.trim()),
  );
</script>

<style lang="scss">
  .listing-general-info {
    border-radius: var(--border-radius-2xl);

    &__body {
      &--collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    &__description {
      white-space: pre-wrap;

      & + & {
        margin-top: 1em;
      }
    }

    &__toggle {
      background: none;
      border: none;
      padding: 0;
      margin-top: var(--size-8);
      cursor: pointer;
      color: var(--primary-400);
      text-decoration: underline;
      text-underline-offset: 2px;
      display: block;
      text-align: left;

      &:hover {
        opacity: 0.8;
      }
    }
  }
</style>
