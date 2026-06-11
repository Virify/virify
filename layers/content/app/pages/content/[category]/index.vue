<template>
  <div class="container">
    <!-- hero -->
    <OrganismsBannerHero
      :caption="page?.caption"
      :description="page?.description"
      compact
    >
      <template #top>
        <UBreadcrumb
          :items="[
            { label: 'Content', to: '/content', icon: 'i-lucide-home' },
            {
              label: page?.title || pageCategory,
              to: undefined,
              icon: 'i-lucide-folder',
            },
          ]"
          :ui="{
            linkLeadingIcon: 'text-secondary',
            link: 'text-white truncate max-w-[20ch]',
          }"
          class="text-white pt-2 pb-2"
        />
      </template>

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
    <div class="my-12">
      <h2 class="title-sm">Recent {{ page?.title }}</h2>
      <ul>
        <li
          v-for="(link, index) in pageLinks"
          :key="index"
        >
          <UButton
            :label="link.title"
            variant="link"
            :to="link.to"
            icon="i-lucide-file"
            :ui="{
              label: 'underline decoration-secondary',
              leadingIcon: 'text-secondary',
            }"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ViewsDialogSignup, ViewsDialogLogin } from "#components";
  const route = useRoute();
  const pageCategory = route.params.category as string;

  const { data: page } = await useSanityQuery<SanityPageCategory>(singleCategoryQuery, {
    category: pageCategory,
  });

  if (!page.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Category page not found",
      fatal: true,
    });
  }

  useSeoMeta({
    title: () => page.value?.seo?.metaTitle,
    description: () => page.value?.seo?.metaDescription,
    keywords: () => page.value?.seo?.keywords,
    robots: () => (page.value?.seo?.noIndex ? "noindex, nofollow" : "index, follow"),

    ogTitle: () => page.value?.seo?.ogTitle,
    ogDescription: () => page.value?.seo?.ogDescription,
    ogType: "website",

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

  const pageLinks = computed(() => {
    return page.value?.pages?.map((p: GeneralPageNavigationItem) => ({
      title: p.title,
      to: `/content/${pageCategory}/${p.slug}`,
      icon: "i-lucide-file",
    }));
  });
</script>
<style lang="scss">
  .bg-change {
    background-color: var(--blue-200);
  }
</style>
