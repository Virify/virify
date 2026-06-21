<template>
  <UPageSection
    :features="featuresMap"
    :orientation="orientation"
    color="secondary"
    :links="styledLinks"
    :ui="{
      container: 'max-w-none p-0! py-16! px-6!',
      wrapper: reverse ? 'lg:order-last' : 'md:order-first',
    }"
  >
    <template #headline>
      <p
        class="text-secondary/90 font-bold"
        :class="{
          'text-center': !features,
        }"
      >
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
        :src="image.asset._id"
        class="w-full h-auto rounded-lg border"
        provider="sanity"
        sizes="sm:100vw md:700px lg:900px xl:1000px"
        densities="1x 2x"
        fit="contain"
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
      class: "rounded-full text-white! body-md",
      icon: button.icon || "i-lucide-arrow-right",
      onClick: getClickHandler(button),
      to: getNavigationTarget(button),
    }));
  });
</script>
