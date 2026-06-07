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
    links: (ButtonProps & { signup?: boolean; login?: boolean; url?: string })[];
    description?: string;
    title?: string;
  }

  const props = defineProps<Props>();

  const styledLinks = props.links.map((link) => ({
    ...link,
    icon: link.icon || "i-lucide-arrow-right",
    class: "button button-secondary",
    onClick:
      link.signup ? () => showDialog({ component: ViewsDialogSignup })
      : link.login ? () => showDialog({ component: ViewsDialogLogin })
      : undefined,
    to: !link.signup && !link.login ? link.url : undefined,
  }));

  const signUpLink = computed(() => props.links.find((link) => link.signup));
  const loginLink = computed(() => props.links.find((link) => link.login));
</script>
