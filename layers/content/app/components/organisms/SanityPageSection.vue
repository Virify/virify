<template>
  <UPageSection
    :features="featuresMap"
    :orientation="orientation"
    color="secondary"
    :links="styledLinks"
    :ui="{
      container: 'max-w-none',
      wrapper: reverse ? 'lg:order-last' : 'md:order-first',
    }"
  >
    <template #headline>
      <p class="text-secondary/90 font-bold" :class="{
        'text-center': !features
      }">
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
        v-if="image?.asset._id"
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
  import { ViewsDialogSignup, ViewsDialogLogin } from "#components";
  const { showDialog } = useDialog();

  interface Props {
    features?: SanityPageSection["features"];
    orientation?: SanityPageSection["orientation"];
    reverse?: boolean;
    headline?: string;
    title?: string;
    description?: string;
    image?: SanityImage;
    buttons?: SanityPageSection["buttons"];
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: "vertical",
    reverse: false,
  });

  function getClickHandler(button: SanitySectionButton) {
    if (button.signup) return () => showDialog({ component: ViewsDialogSignup });
    if (button.login) return () => showDialog({ component: ViewsDialogLogin });
    return undefined;
  }

  function getNavigationTarget(button: SanitySectionButton) {
    const isModalAction = button.signup || button.login;
    return isModalAction ? undefined : button.url;
  }

  const featuresMap = computed(() => {
    return props.features?.map((feature) => ({
      ...feature,
      ui: {
        leadingIcon: feature.iconColor,
      },
    }));
  });

  const styledLinks = computed(() => {
    return props.buttons?.map((button) => ({
      ...button,
      class: 'rounded-full text-white! body-md',
      icon: button.icon || "i-lucide-arrow-right",
      onClick: getClickHandler(button),
      to: getNavigationTarget(button),
    }));
  });
</script>
