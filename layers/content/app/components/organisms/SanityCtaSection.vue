<template>
  <UPageCTA
    :title="title"
    variant="naked"
    :links="links"
    :ui="{
      container: 'max-w-none',
    }"
  >
    <template #description>
      <p>
        {{ description }}
      </p>
    </template>
  </UPageCTA>
</template>
<script setup lang="ts">
  import type { ButtonProps } from "@nuxt/ui";

  interface Props {
    links: ButtonProps[];
    description?: string;
    title?: string;
  }

  defineProps<Props>();
</script>
