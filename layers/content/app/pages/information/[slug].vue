<template>
  <div class="container">
    <!-- hero -->
    <OrganismsBannerHero :caption="page?.caption" :description="page?.description">
      <template #title>
        <span>{{ page?.title}}</span>
      </template>
      <UButton
        v-for="(button, index) in page?.heroButtons || []"
        :key="index"
        :label="button.label"
        :icon="button.icon"
        @click="button.signup ? showSignup() : button.login ? showLogin() : null"
        :to="button.url || undefined"
        class="button button-secondary mt-6!"
      />
    </OrganismsBannerHero>

    <!-- sign up cta -->
    <OrganismsSanityCtaSection :links="page?.sections?.[0]?.buttons" :description="page?.sections?.[0]?.description" :title="page?.sections?.[0]?.title" />

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
import { ViewsDialogSignup, ViewsDialogLogin } from "#components";
import type { ButtonProps, PageFeatureProps } from "@nuxt/ui";

const route = useRoute();
const pageSlug = route.params.slug as string;

const { data: page } = await useSanityQuery(generalPageQuery, { slug: pageSlug });

const { showDialog } = useDialog();

function showSignup() {
  showDialog({ component: ViewsDialogSignup });
}

function showLogin() {
  showDialog({ component: ViewsDialogLogin });
}

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
