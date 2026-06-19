<template>
  <div class="container">
    <!-- hero -->
    <OrganismsBannerHero
      :caption="page?.caption"
      :description="page?.description"
    >
      <template #title>
        <span>{{ page?.title }}</span>
      </template>

      <UButton
        v-for="(button, index) in page?.heroButtons || []"
        :key="index"
        :label="button.label"
        :icon="button.icon"
        @click="
          button.signup ? showSignup()
          : button.login ? showLogin()
          : null
        "
        :to="button.url || undefined"
        class="button button-secondary mt-6!"
      />
    </OrganismsBannerHero>

    <component
      v-for="(section, index) in page?.sections || []"
      :key="index"
      :is="resolveComponent(section)"
      v-bind="section"
    />
  </div>
</template>
<script setup lang="ts">
  import {
    ViewsDialogSignup,
    ViewsDialogLogin,
    OrganismsSanityPageSection,
    OrganismsSanityPageFaqSection,
    OrganismsSanityPageGuidesGrid,
  } from "#components";

  const route = useRoute();
  const pageSlug = route.params.slug as string;

  const { data: page } = await useSanityQuery<SanityGeneralPage>(informationPageQuery, {
    slug: pageSlug,
  });

  if (!page.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  useSeoMeta({
    title: () => page.value?.seo?.metaTitle,
    description: () => page.value?.seo?.metaDescription,
    keywords: () => page.value?.seo?.keywords,
    robots: () => (page.value?.seo?.noIndex ? "noindex, nofollow" : "index, follow"),

    // Open Graph Social Preview Tags
    ogTitle: () => page.value?.seo?.ogTitle,
    ogDescription: () => page.value?.seo?.ogDescription,
    ogType: "website",

    // Twitter / X Layout Rule Overrides
    twitterCard: () => page.value?.seo?.twitterCard,
    twitterTitle: () => page.value?.seo?.ogTitle,
    twitterDescription: () => page.value?.seo?.ogDescription,
  });

  useHead({
    link: [
      {
        rel: "canonical",
        href: () => page.value?.seo?.canonicalUrl || undefined,
      },
    ],
  });

  const { showDialog } = useDialog();

  function showSignup() {
    showDialog({ component: ViewsDialogSignup });
  }

  function showLogin() {
    showDialog({ component: ViewsDialogLogin });
  }

  const componentMap: Record<string, any> = {
    pageSection: OrganismsSanityPageSection,
    pageFaq: OrganismsSanityPageFaqSection,
    pageGuidesGrid: OrganismsSanityPageGuidesGrid,
  };

  function resolveComponent(section: any) {
    return componentMap[section._type] || null;
  }
</script>
<style lang="scss">
  .bg-change {
    background-color: var(--blue-200);
  }
</style>
