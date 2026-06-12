<template>
  <section
    v-if="description"
    class="listing-general-info"
  >
    <h3 class="listing-general-info__title | title-md">Property Description</h3>
    <p
      v-for="(paragraph, i) in paragraphs"
      :key="i"
      class="listing-general-info__description | r-body-md-sm"
    >
      {{ paragraph }}
    </p>
  </section>
</template>

<script setup lang="ts">
  interface Props {
    description?: string;
  }

  const props = defineProps<Props>();

  const paragraphs = computed(() =>
    (props.description ?? "").split(/\n\n+/).filter((p) => p.trim()),
  );
</script>

<style lang="scss">
  .listing-general-info {
    border-radius: var(--border-radius-2xl);

    &__description {
      white-space: pre-wrap;

      & + & {
        margin-top: 1em;
      }
    }
  }
</style>
