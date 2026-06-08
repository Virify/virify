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
    OrganismsSanityPageCtaSection, 
    OrganismsSanityPageSection, 
    OrganismsSanityPageFaqSection,
    OrganismsSanityPageGuidesGrid
  } from "#components";

  const route = useRoute();
  const pageSlug = route.params.slug as string;

  const { data: page } = await useSanityQuery<SanityGeneralPage>(generalPageQuery, { slug: pageSlug });

  const { showDialog } = useDialog();

  function showSignup() {
    showDialog({ component: ViewsDialogSignup });
  }

  function showLogin() {
    showDialog({ component: ViewsDialogLogin });
  }

  const componentMap: Record<string, any> = {
    pageCta: OrganismsSanityPageCtaSection,
    pageSection: OrganismsSanityPageSection,
    pageFaq: OrganismsSanityPageFaqSection,
    pageGuidesGrid: OrganismsSanityPageGuidesGrid,
  };

  function resolveComponent(section: any) {
    return componentMap[section._type] || null;
  }
</script>
