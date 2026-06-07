<template>
  <div class="container">
    <!-- hero -->
    <OrganismsBannerHero :caption="caption" :description="description">
      <template #title>
        <span>{{ title }}</span>
      </template>
      <UButton
        v-if="!loggedIn"
        class="button button-secondary mt-6!"
        icon="i-lucide-user-plus"
        @click="showSignup"
      >
        Sign Up
      </UButton>
    </OrganismsBannerHero>
    <!-- sign up cta -->
    <OrganismsSanityCtaSection :links="ctaSectionLinks" :description="ctaSectionDescription" :title="ctaSectionTitle" />

    <!-- page sections -->
    <OrganismsSanityPageSection
      :features="whatYouCanDoFeatures"
      headline="Property search and some features are still being refined during early access."
      title="What you can do during early access"
      description="During early access, users can create and manage live property listings while helping us improve the listing journey."
      orientation="horizontal"
      :image="{ src: '/img/create-listing.png', alt: 'What you can do during early access' }"
    />

    <!-- page sections -->
    <OrganismsSanityPageSection
      :features="whatYouCanDoFeatures"
      headline="Property search and some features are still being refined during early access."
      title="What you can do during early access"
      description="During early access, users can create and manage live property listings while helping us improve the listing journey."
      orientation="horizontal"
      :image="{ src: '/img/create-listing.png', alt: 'What you can do during early access' }"
      reverse      
    />
  </div>
</template>
<script setup lang="ts">
import type { ButtonProps, PageFeatureProps } from "@nuxt/ui";
import { ViewsDialogSignup } from "#components";
const { loggedIn } = useUserSession();

const { showDialog } = useDialog();

function showSignup() {
  showDialog({ component: ViewsDialogSignup });
}

const title = "Virify early Access is live!";
const description =
  "A smarter property platform built around clearer listings, useful tools and a better experience for buyers, sellers, renters and agents.";
const caption = "Free to use, and always will be";

const ctaSectionTitle = "Live for sign-ups and selected testing";

const ctaSectionDescription = "Property listing creation is currently available to selected property owners and agents. Property search is also running in a limited mode while we test and refine the core workflows.";

const ctaSectionLinks = ref<ButtonProps[]>([
  {
    label: "Sign Up",
    onClick: showSignup,
    color: "secondary",
    icon: "i-lucide-user-plus",
    size: "lg",
    variant: "subtle",
    class: "button button-secondary",
  },
]);

const whatYouCanDoFeatures = ref<PageFeatureProps[]>([
  {
    title: "Create an account and access the dashboard",
    icon: "i-lucide-list-check",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Create, save and manage live property listings",
    icon: "i-lucide-search",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "View live property listings via social media or direct links",
    icon: "i-lucide-message-square",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Preview listings before publishing",
    icon: "i-lucide-thumbs-up",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Share draft listings for review or verification",
    icon: "i-lucide-heart",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Manage enquiries, viewings and open houses",
    icon: "i-lucide-flag",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Use Price Paid Data to research sold prices by postcode",
    icon: "i-lucide-pen-tool",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title: "Use the Mortgage Calculator to estimate monthly payments",
    icon: "i-lucide-message-circle",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
  {
    title:
      "Save property listings, add notes and manage property interactions where available",
    icon: "i-lucide-thumbs-down",
    ui: {
      leadingIcon: "text-secondary",
    },
  },
]);
</script>
