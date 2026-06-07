<template>
  <UPageSection
    :features="features"
    :orientation="orientation"
    color="secondary"
    :ui="{
      container: 'max-w-none',
    }"
    :reverse="reverse && isDesktop"
  >
    <template #headline>
      <p class="text-secondary/90 w-full font-bold">
        {{ headline }}
      </p>
    </template>
    <template #title>
      <span>{{ title }}</span>
    </template>
    <template #description>
      <p>
        {{ description }}
      </p>
    </template>
    <template #default>
      <NuxtImg
        :src="image?.src || '/img/create-listing.png'"
        :alt="image?.alt || 'What you can do during early access'"
        class="w-full rounded-lg border object-cover"
        quality="80"
        densities="[1, 2]"
      />
    </template>
  </UPageSection>
</template>
<script setup lang="ts">
  import type { PageFeatureProps } from "@nuxt/ui";
  // Detect if we're on desktop for layout purposes
  const isDesktop = useDesktop();

  interface Props {
    features?: PageFeatureProps[];
    orientation?: "horizontal" | "vertical";
    reverse?: boolean;
    headline?: string;
    title?: string;
    description?: string;
    image?: {
      src: string;
      alt: string;
    };
  }

  withDefaults(defineProps<Props>(), {
    orientation: "vertical",
    reverse: false,
  });
</script>
