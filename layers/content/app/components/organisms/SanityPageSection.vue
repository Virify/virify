<template>
  <UPageSection
    :features="featuresMap"
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
        :src="image?.asset._id"
        class="w-full rounded-lg border object-cover"
        :alt="image?.alt || 'Page section image'"
        :placeholder="image?.asset.metadata?.lqip"
        provider="sanity"
      />
    </template>
  </UPageSection>
</template>
<script setup lang="ts">
  import type { PageFeatureProps } from "@nuxt/ui";
  // Detect if we're on desktop for layout purposes
  const isDesktop = useDesktop();

  interface Props {
    features?: SanityPageSection['features'];
    orientation?: SanityPageSection['orientation'];
    reverse?: boolean;
    headline?: string;
    title?: string;
    description?: string;
    image?: SanityImage;
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: "vertical",
    reverse: false,
  });

  const featuresMap = computed(() => {
    return props.features?.map((feature) => ({
      ...feature,
      ui: {
        leadingIcon: feature.iconColor
      } ,
    }));
  });
</script>
