<template>
  <UPageCTA
    :title="title"
    variant="naked"
    :links="styledLinks"
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
  import { ViewsDialogSignup, ViewsDialogLogin } from "#components";

  const { showDialog } = useDialog();

  interface Props {
    buttons: SanityCtaSectionButton[];
    description?: string;
    title?: string;
  }

  const props = defineProps<Props>();

  function getClickHandler(button: SanityCtaSectionButton) {
    if (button.signup) return () => showDialog({ component: ViewsDialogSignup });
    if (button.login) return () => showDialog({ component: ViewsDialogLogin });
    return undefined;
  }

  function getNavigationTarget(button: SanityCtaSectionButton) {
    const isModalAction = button.signup || button.login;
    return isModalAction ? undefined : button.url;
  }

  const styledLinks = computed(() => {
    return props.buttons.map((button) => ({
      ...button,
      class: "button button-secondary",
      icon: button.icon || "i-lucide-arrow-right",
      onClick: getClickHandler(button),
      to: getNavigationTarget(button),
    }));
  });
</script>
