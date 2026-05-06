<template>
  <div class="p-index">
    <HomepageSectionSearch v-if="search || isAdmin" class="p-index__search | container" />

    <div v-else class="p-index__hero">
      <HomepageSectionSignup class="| container" />
    </div>


    <!-- Features -->
    <HomepageSectionComingSoon class="| container" />

    <a id="homepage-content" class="| inline-scroll-margin"></a>

    <HomepageSectionAiScroller class="| container" />

    <div class="p-index__bg-change">
      <HomepageSectionMapScroller class="| container" />
    </div>

    <HomepageSectionComms class="| container" />

    <div class="p-index__bg-change">
      <HomepageSectionLocation class="| container" />
    </div>

    <!-- sellers section -->
    <UPageSection :title="cmsContent?.sellersBenefits.title || 'What we offer sellers'"
      :description="cmsContent?.sellersBenefits.subtitle || ''" headline="You're in control" :ui="{
        root: '| container',
        headline: 'text-secondary',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }">
      <template #body>
        <UPageCard v-for="(feature, index) in cmsContent?.sellersBenefits.features" :key="index"
          icon="i-lucide-chart-no-axes-gantt" :title="feature.title" :description="feature.description"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right" :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm text-(--monochrome-900)',
            body: 'flex flex-col justify-evenly',
          }">
        </UPageCard>
      </template>
    </UPageSection>

    <!-- buyers section -->
    <UPageSection :title="cmsContent?.buyersBenefits.title || 'What we offer buyers'"
      :description="cmsContent?.buyersBenefits.subtitle || ''" headline="Get the best results" :ui="{
        root: 'p-index__hero-dark p-index__border-radius | container',
        headline: 'text-secondary/90!',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }">
      <template #body>
        <UPageCard v-for="(feature, index) in cmsContent?.buyersBenefits.features" :key="index"
          icon="i-lucide-chart-no-axes-gantt" :title="feature.title" :description="feature.description"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right" :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }">
        </UPageCard>
      </template>
    </UPageSection>

    <!-- contact us cta -->
    <UPageCTA :title="cmsContent?.contactSection.title" :description="cmsContent?.contactSection.description" :ui="{
      root: 'rounded-none ring-0',
    }" :links="[
      {
        label: cmsContent?.contactSection.buttonText || 'Contact Us',
        to: '/contact',
        color: 'neutral',
        icon: 'i-lucide-mail',
        size: 'xl',
        variant: 'solid',
        class: 'font-bold button button-secondary',
      },
    ]" />

    <UPageSection :title="cmsContent?.earlyAccessBenefits.title" :description="cmsContent?.earlyAccessBenefits.subtitle"
      headline="Early Access Benefits" class="p-index__hero-dark p-index__border-radius | container" :ui="{
        headline: 'text-secondary',
      }">
      <template #features>
        <UPageCard v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits" :key="index"
          icon="i-lucide-info" :title="benefit.title" :description="benefit.description"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right" :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }">
        </UPageCard>
      </template>
    </UPageSection>

    <!-- guides -->
    <UPageSection :title="cmsContent?.guidesSection?.title" :description="cmsContent?.guidesSection?.description"
      headline="Helpful Guides" :ui="{
        headline: 'text-secondary',
      }">
      <UBlogPosts>
        <UBlogPost v-for="(guide, index) in cmsContent?.guidesSection?.guides" :key="index" variant="subtle"
          :title="guide.title" :description="guide.excerpt" :to="'guides/' + guide.category.slug.current + '/' + guide.slug.current
            " :badge="'Read Time: ' + guide.readTime + ' mins'" :date="guide.publishedAt" :authors="[
              {
                name: 'Virify',
                avatar: {
                  src: '/android-chrome-96x96.png',
                  alt: 'Virify',
                }
              }

            ]" :image="{
              provider: 'sanity',
              src: guide.heroImage?.asset._ref,
              alt: guide.heroImage?.alt || guide.title,
              width: 800,
              height: 600,
              loading: index < 3 ? 'eager' : 'lazy',
            }" :ui="{
              title: 'body-md font-bold',
              meta: 'justify-between',
              description: 'body-sm',
              body: 'justify-evenly',
            }" />
      </UBlogPosts>
    </UPageSection>

    <!-- final cta section -->
    <UPageCTA :title="cmsContent?.finalCta.title" :description="cmsContent?.finalCta.description" :ui="{
      root: 'rounded-none ring-0 bg-(--blue-200)!',
      header: 'text-(--monochrome-900)',
    }" :links="[
      {
        label: cmsContent?.finalCta.buttonText || 'Contact Us',
        color: 'neutral',
        icon: 'i-lucide-mail',
        size: 'lg',
        variant: 'solid',
        class: 'font-bold button button-secondary',
      },
    ]" @click="showSignupForm" />
  </div>
</template>

<script setup lang="ts">
const { search, isAdmin } = useFeatureFlag();

// Fetch CMS content - module automatically uses correct perspective
const { data: cmsContent, error: cmsError } =
  await useSanityQuery<WaitingListPage>(waitingListPageQuery);

// Process feature sections: clean stega encoding and determine which image props to pass
const processedFeatureSections = computed(() =>
  processFeatureSections(cmsContent.value?.featureSections),
);

// SEO - Nuxt SEO auto-generates WebPage schema from this
// Use CMS SEO metadata if available, otherwise fallback to defaults
const seoData = computed(() => {
  const cms = cmsContent.value?.seo;

  return {
    title: cms?.metaTitle,
    description: cms?.metaDescription,
    keywords: cms?.keywords,
    ogTitle: cms?.ogTitle,
    ogDescription: cms?.ogDescription,
    ogImage: cms?.ogImage,
    twitterCard: cms?.twitterCard,
    canonicalUrl: cms?.canonicalUrl,
  };
});

useSeoMeta({
  title: seoData.value.title,
  description: seoData.value.description,
  keywords: seoData.value.keywords,
  ogTitle: seoData.value.ogTitle,
  ogDescription: seoData.value.ogDescription,
  ogType: "website",
  ogUrl: "https://virify.co.uk",
  twitterCard: seoData.value.twitterCard as "summary" | "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: seoData.value.canonicalUrl }],
});

// Custom breadcrumbs
useSchemaOrg([
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://virify.co.uk",
      },
    ],
  },
]);

import { ViewsDialogWaitingList } from '#components'

/**
 *  Show waiting list form
 */
const { showDialog } = useDialog()

function showSignupForm() {
  showDialog({
    component: ViewsDialogWaitingList
  })
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.p-index {

  &__hero {
    overflow: hidden;
  }

  &__hero-dark {
    color: var(--monochrome-900);
    background: var(--blue-200);
  }

  &__border-radius {
    border-radius: var(--border-radius-2xl);

    @include mq.tablet {
      border-radius: var(--border-radius-3xl);
    }

    @include mq.desktop {
      border-radius: var(--border-radius-4xl);
    }
  }

  &__bg-change {
    background-color: var(--blue-200);
    padding: var(--size-120) 0;
  }
}
</style>
