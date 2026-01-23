<template>
  <div class="waiting-list-page">
    <UPageHero
      :title="cmsContent?.hero.title || 'Join the waiting list'"
      :description="
        cmsContent?.hero.subtitle ||
        'Virify makes property search and marketing simple for everyone. With simple tools and smart, natural-language search with advanced filters to help you find exactly what you need.'
      "
      headline="Join the waiting list"
      :orientation="isWaitingListMode ? 'horizontal' : 'vertical'"
      :ui="{
        root: 'hero-gradient-bg z-2',
        headline: 'text-secondary',
        title: 'title-2xl text-white!',
        description: 'text-white body-lg',
      }"
    >
      <div
        v-if="isWaitingListMode"
        class="flex justify-center items-center w-full px-4 sm:px-6"
      >
        <MoleculesImageSwap
          front-image="/img/natural_lang.png"
          back-image="/img/traditional.png"
          front-label="Natural Language"
          back-label="Traditional Search"
          class="w-full max-w-2xl"
        />
      </div>
      <div v-else class="max-w-200 w-full m-auto">
        <OrganismsDockBanner listingType="all" />
      </div>
    </UPageHero>

    <!-- sign up form -->
    <UPageSection
      :title="cmsContent?.formSection.title || 'Join the Waiting List'"
      :description="
        cmsContent?.formSection.description || 'Be the first to know'
      "
      headline="Stay updated"
      :ui="{
        title: 'title-md',
        headline: 'text-secondary/90!',
      }"
    >
      <UForm
        :schema="signupSchema"
        :state="state"
        class="max-w-200 w-full m-auto flex flex-col items-start gap-4"
        @submit="handleSubmit"
      >
        <UFormField name="email" label="Email Address" required class="w-full">
          <UInput
            v-model="state.email"
            type="email"
            :disabled="isSubmitting || isSuccess"
            placeholder="Enter your email"
            trailingIcon="i-lucide-mail"
            class="w-full"
            :ui="{
              base: 'p-3 focus:ring-secondary!',
            }"
          />
        </UFormField>
        <div class="flex flex-col md:flex-row justify-between w-full gap-4">
          <UFormField name="agreedToTerms">
            <UCheckbox
              v-model="state.agreedToTerms"
              :disabled="isSubmitting || isSuccess"
              :ui="{
                indicator: 'bg-secondary',
              }"
            >
              <template #label>
                <span class="body-sm">
                  I agree to the
                  <NuxtLink to="/terms" class="link">Terms & Conditions</NuxtLink>
                  and
                  <NuxtLink to="/privacy" class="link">Privacy Policy</NuxtLink>
                </span>
              </template>
            </UCheckbox>
          </UFormField>
          <UButton
            type="submit"
            :label="cmsContent?.formSection?.buttonText || 'Join Now'"
            variant="solid"
            :pending="isSubmitting"
            :disabled="!state.agreedToTerms || !state.email || isSuccess"
            loading-auto
            size="xl"
            class="font-bold rounded-full bg-(--monochrome-100) text-(--monochrome-900)! hover:bg-(--blue-500) px-5 body-md"
          />
        </div>
      </UForm>
    </UPageSection>

    <!-- Features -->
    <UPageCTA
      v-for="(section, index) in processedFeatureSections"
      orientation="horizontal"
      variant="soft"
      :class="index % 2 === 0 ? 'section-gradient-bg' : ''"
      :reverse="index % 2 !== 0"
      :ui="{
        body: 'border-0 radius-0',
        root: 'rounded-none',
        title: 'text-secondary/90!',
      }"
    >
      <template #title>
        <h2>{{ section.title }}</h2>
      </template>

      <template #description>
        <p class="body-md">
          {{ section.subtitle }}
        </p>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <UPageFeature
            v-for="feature in section.features"
            icon="i-lucide-info"
            :title="feature.title"
            :description="feature.description"
            :ui="{
              description: 'body-sm',
              leadingIcon: 'text-secondary h-6 w-6',
            }"
          >
          </UPageFeature>
        </div>
      </template>

      <AtomsCloudFlareImage
        v-if="section.image"
        :src="section.image"
        :alt="section.imageAlt"
        class="h-auto w-full"
      />
    </UPageCTA>

    <!-- sellers section -->
    <UPageSection
      :title="cmsContent?.sellersBenefits.title || 'What we offer sellers'"
      :description="cmsContent?.sellersBenefits.subtitle || ''"
      headline="Your in control"
      :ui="{
        headline: 'text-secondary/90!',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }"
    >
      <template #body>
        <UPageCard
          v-for="(feature, index) in cmsContent?.sellersBenefits.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          variant="subtle"
          spotlight
          spotlight-color="primary"
          icon="i-lucide-chart-no-axes-gantt"
          :ui="{
            title: 'text-secondary/90!',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
          }"
        />
      </template>
    </UPageSection>

    <!-- buyers section -->
    <UPageSection
      :title="cmsContent?.buyersBenefits.title || 'What we offer buyers'"
      :description="cmsContent?.buyersBenefits.subtitle || ''"
      headline="Get the best results"
      :ui="{
        root: 'section-gradient-bg',
        headline: 'text-secondary/90!',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6',
      }"
    >
      <template #body>
        <UPageCard
          v-for="(feature, index) in cmsContent?.buyersBenefits.features"
          :key="index"
          :title="feature.title"
          :description="feature.description"
          variant="subtle"
          spotlight
          spotlight-color="secondary"
          icon="i-lucide-chart-no-axes-gantt"
          :ui="{
            spotlight: 'bg-primary/50!',
            root: 'bg-primary/50! ring-primary/60',
            container: 'border-secondary!',
            title: 'text-secondary/90!',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
          }"
        />
      </template>
    </UPageSection>

    <!-- contact us cta -->
    <UPageCTA
      :title="cmsContent?.contactSection.title"
      :description="cmsContent?.contactSection.description"
      :ui="{
        root: 'rounded-none ring-0',
      }"
      :links="[
        {
          label: cmsContent?.contactSection.buttonText || 'Contact Us',
          to: '/contact',
          color: 'neutral',
          icon: 'i-lucide-mail',
          size: 'xl',
          variant: 'solid',
          class:
            'font-bold rounded-full bg-(--monochrome-100) text-(--monochrome-900)! hover:bg-(--blue-500) p-4',
        },
      ]"
    />

    <!-- TODO: REPLACE THE REST OF THIS PAGE -->
    <UPageSection
      :title="cmsContent?.earlyAccessBenefits.title"
      :description="cmsContent?.earlyAccessBenefits.subtitle"
      headline="Early Access Benefits"
      class="section-gradient-bg"
    >
      <template #features>
        <UPageCard
          v-for="(benefit, index) in cmsContent?.earlyAccessBenefits.benefits"
          :key="index"
          icon="i-lucide-info"
          :title="benefit.title"
          :description="benefit.description"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-primary/50! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        >
        </UPageCard>
      </template>
    </UPageSection>

    <!-- guides -->
    <UPageSection
      :title="cmsContent?.guidesSection?.title"
      :description="cmsContent?.guidesSection?.description"
      headline="Helpful Guides"
      :ui="{
        headline: 'text-secondary',
      }"
    >
      <UBlogPosts>
        <UBlogPost
          v-for="(guide, index) in cmsContent?.guidesSection?.guides"
          :key="index"
          variant="subtle"
          :title="guide.title"
          :description="guide.excerpt"
          :to="
            'guides/' + guide.category.slug.current + '/' + guide.slug.current
          "
          :badge="'Read Time: ' + guide.readTime + ' mins'"
          :date="guide.publishedAt"
          :authors="[
            {
              name: 'Virify',
              avatar: {
                src: '/android-chrome-96x96.png',
                alt: 'Virify',
              },
            },
          ]"
          :image="{
            provider: 'sanity',
            src: guide.heroImage?.asset._ref,
            alt: guide.heroImage?.alt || guide.title,
          }"
          :ui="{
            title: 'body-md font-bold',
            meta: 'justify-between',
            description: 'body-sm',
            body: 'justify-evenly',
          }"
        />
      </UBlogPosts>
    </UPageSection>

    <!-- final cta section -->
    <UPageCTA
      :title="cmsContent?.finalCta.title"
      :description="cmsContent?.finalCta.description"
      :ui="{
        root: 'rounded-none ring-0',
      }"
      class="section-gradient-bg"
      :links="[
        {
          label: cmsContent?.finalCta.buttonText || 'Contact Us',
          color: 'neutral',
          icon: 'i-lucide-mail',
          size: 'lg',
          variant: 'solid',
          class:
            'font-bold rounded-full bg-(--monochrome-100) text-(--monochrome-900)! hover:bg-(--blue-500) p-4',
        },
      ]"
      @click="scrollToForm"
    />
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
const { isWaitingListMode } = useWaitingListMode();
const toast = useToast();

// Fetch CMS content - module automatically uses correct perspective
const { data: cmsContent, error: cmsError } =
  await useSanityQuery<WaitingListPage>(waitingListPageQuery);

// Process feature sections: clean stega encoding and determine which image props to pass
const processedFeatureSections = computed(() =>
  processFeatureSections(cmsContent.value?.featureSections),
);

const isSubmitting = ref(false);
const isSuccess = ref(false);
const message = ref("You're on the list! Check your email for confirmation.");

const signupSchema = z.object({
  email: z.email("Please enter a valid email address"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type Schema = z.output<typeof signupSchema>;

const state = reactive<Schema>({
  email: "",
  agreedToTerms: false,
});

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      alreadyExists?: boolean;
    }>("/api/waiting-list", {
      method: "POST",
      body: {
        email: state.email,
      },
    });

    if (response.success) {
      message.value = response.message;
      toast.add({
        icon: "i-lucide-check-circle",
        title: "Success",
        description: message.value,
        color: "success",
      });
    }
  } catch (error: any) {
    console.error("Waiting list signup error:", error);
  } finally {
    isSubmitting.value = false;
  }
}

function scrollToForm() {
  const formSection = document.querySelector(".waiting-list-form-section");
  if (formSection) {
    formSection.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

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
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;
@use "#styles/3-elements/sections" as *;

.section-gradient-bg {
  @include section-gradient-bg();
}

.hero-gradient-bg {
  @include section-gradient-bg();

  @include mq.desktop {
    @include hero-background();
  }
}
</style>
