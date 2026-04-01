<template>
  <div class="price-paid-page">
    <!-- Hero -->
    <OrganismsBannerHero class="container" compact description="Real sold prices from HM Land Registry. Search by postcode to see sale histories and trends for any address.">
      <template #title> <span>Price Paid</span> Data </template>
    </OrganismsBannerHero>

    <!-- Form + results (unchanged) -->
    <div class="price-paid | container">
      <AtomsHeroCard class="price-paid__hero">
        <p class="| body-md">Enter a UK postcode and search for property sales history</p>
        <div class="price-paid__search">
          <div class="price-paid__input">
            <AtomsInput v-model="searchQuery" type="text" placeholder="e.g., 'CF10 1AA' or 'cf101aa'" required class="| body-sm" :disabled="loading" @keyup.enter="search" />
          </div>
          <div class="price-paid__button">
            <button class="| button button-secondary button-md" @click="search" :disabled="loading">
              <span v-if="loading">Searching...</span>
              <span v-else>Search</span>
            </button>
          </div>
        </div>
      </AtomsHeroCard>

      <div v-if="results.length > 0" class="price-paid__results">
        <ul class="price-paid__list">
          <li v-for="(result, index) in results" :key="index" class="price-paid__item">
            <MoleculesTimeline :title="result.full_address" :type="result.property_type_display" :duration="result.duration_display" :items="formatTimelineItems(result.sales)" />
          </li>
        </ul>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="price-paid__loading">
        <div class="loading-container">
          <SkeletonLoader class="loading-skeleton loading-skeleton--title" />
          <div class="loading-skeleton-group">
            <SkeletonLoader class="loading-skeleton loading-skeleton--item" />
            <SkeletonLoader class="loading-skeleton loading-skeleton--item" />
            <SkeletonLoader class="loading-skeleton loading-skeleton--item" />
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="price-paid__error">
        <div class="error-message">
          <h3 class="| title-sm">Something went wrong</h3>
          <p class="| body-md">{{ error }}</p>
          <button class="| button button-secondary button-sm" @click="error = null">Try again</button>
        </div>
      </div>

      <!-- No Results State -->
      <div v-else-if="searched && results.length === 0" class="price-paid__no-results">
        <div class="no-results-message">
          <h3 class="| title-sm">No results found</h3>
          <p class="| body-md">We couldn't find any price paid data for this postcode. Try a different postcode or check the spelling.</p>
        </div>
      </div>
    </div>

    <UPageSection
      title="What you can do with Price Paid data"
      description="Explore recent sold prices, track local market momentum, and understand how a home's value has changed over time. This is a preview of the tools we're building."
      class="p-index__border-radius | container"
      :ui="{
        container: 'pt-4!',
        headline: 'text-secondary',
        body: 'flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-white',
        footer: 'flex justify-center',
      }"
    >
      <template #body>
        <UPageCard
          icon="i-lucide-history"
          title="See sold history by address"
          description="Look up a property and see its full sale timeline with prices and transfer dates."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
        <UPageCard
          icon="i-lucide-trending-up"
          title="Track local trends"
          description="Understand price momentum in your area over the last 12–36 months."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
        <UPageCard
          icon="i-lucide-map"
          title="Map the neighbourhood"
          description="Spot streets and pockets that outperform the postcode average."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
        <UPageCard
          icon="i-lucide-building-2"
          title="Compare property types"
          description="See how detached, semi, terrace, and flats differ in both price and velocity."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
        <UPageCard
          icon="i-lucide-search"
          title="Verify asking prices"
          description="Sense‑check current listings against actual sold prices nearby."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
        <UPageCard
          icon="i-lucide-calendar"
          title="Timing the move"
          description="See when sales cluster and how that affects negotiation power."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{ root: 'bg-[#2b3945]! ring-0', container: 'shadow-xl', title: 'title-md', leadingIcon: 'h-6 w-6 text-secondary', description: 'body-sm', body: 'flex flex-col justify-evenly' }"
        />
      </template>

      <template #footer>
        <UButton to="/" variant="solid" class="button button-secondary | font-bold" size="xl" icon="i-lucide-mail">Join the waiting list</UButton>
      </template>
    </UPageSection>
  </div>
</template>
<script lang="ts" setup>
import { z } from "zod";

const searchQuery = ref<string>("");
const results = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searched = ref(false);

async function search() {
  if (searchQuery.value.trim() === "") {
    return;
  }

  loading.value = true;
  error.value = null;
  searched.value = false;

  try {
    // Validate and format the postcode
    const validatedPostcode = postcodeSchema.parse(searchQuery.value.trim());

    const response = await $fetch<any>("/api/price-paid/", {
      method: "POST",
      body: { postcode: validatedPostcode },
    });
    results.value = response.data || [];
    searched.value = true;
  } catch (err: any) {
    console.error("Error searching price paid data:", err);

    // Check if it's a validation error from Zod
    if (err instanceof z.ZodError) {
      error.value = err.issues[0]?.message || "Invalid postcode format";
    } else {
      error.value = err.data?.statusMessage || "Failed to search price paid data. Please try again.";
    }
    results.value = [];
    searched.value = false;
  } finally {
    loading.value = false;
  }
}

function formatTimelineItems(sales: any[]) {
  return sales.map((sale) => ({
    id: sale.transaction_id,
    title: `Price Sold: £${sale.price.toLocaleString()}`,
    date: sale.transfer_date,
  }));
}

// SEO - Nuxt SEO auto-generates WebPage schema from this
useSeoMeta({
  title: "UK Price Paid Data - Free Property Sale History Search | Virify",
  description: "Search real property sale prices from HM Land Registry. View complete sale histories, market trends, and actual sold prices by postcode. Free UK property price data.",
  keywords: "UK price paid data, property sale prices, HM Land Registry, house sale history, property sold prices, UK postcode search, land registry data",
  ogTitle: "UK Price Paid Data - Free Property Sale History Search | Virify",
  ogDescription: "Search real property sale prices from HM Land Registry. View complete sale histories and market trends by postcode.",
  ogType: "website",
  ogUrl: "https://virify.co.uk/price-paid",
  twitterCard: "summary",
});

useHead({
  link: [{ rel: "canonical", href: "https://virify.co.uk/price-paid" }],
});

// Custom breadcrumbs
useSchemaOrg([
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://virify.co.uk" },
      { "@type": "ListItem", position: 2, name: "Price Paid Data", item: "https://virify.co.uk/price-paid" },
    ],
  },
]);
</script>
<style lang="scss" scoped>
.price-paid-page {
  background: var(--background-200);
}

.price-paid {
  padding: var(--size-64) 0;

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: auto;
    max-width: 600px;
  }

  &__search {
    display: flex;
    gap: var(--size-12);
    align-items: baseline;
    margin-top: var(--size-8);
    width: 100%;
  }

  &__input {
    flex: 1;
    min-width: 0;
  }

  &__button {
    flex-shrink: 0;
  }

  &__results {
    margin-top: var(--size-48);
  }

  &__list {
    margin-top: var(--size-32);
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-48);
    list-style: none;
    padding: 0;

    @media (min-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__item {
    width: 100%;
    padding: var(--size-32);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);

  }

  &__loading {
    margin-top: var(--size-48);
    display: flex;
    justify-content: center;

    .loading-container {
      width: 100%;
      max-width: 800px;
    }

    .loading-skeleton {
      background: linear-gradient(90deg, var(--background-300) 25%, var(--background-100) 50%, var(--background-300) 75%);
      background-size: 200% 100%;
      animation: loading-shimmer 1.5s infinite;
      border-radius: var(--border-radius-md);

      &--title {
        height: 32px;
        width: 60%;
        margin-bottom: var(--size-24);
      }

      &--item {
        height: 80px;
        width: 100%;
        margin-bottom: var(--size-16);
      }
    }

    .loading-skeleton-group {
      display: flex;
      flex-direction: column;
      gap: var(--size-16);
    }
  }

  &__error {
    margin-top: var(--size-48);
    display: flex;
    justify-content: center;

    .error-message {
      text-align: center;
      padding: var(--size-32);
      border-radius: var(--border-radius-lg);
      background: var(--background-100);
      border: 1px solid var(--border-100);
      max-width: 400px;

      h3 {
        color: var(--red-500);
        margin-bottom: var(--size-12);
      }

      p {
        margin-bottom: var(--size-20);
        color: var(--foreground-200);
      }
    }
  }

  &__no-results {
    margin-top: var(--size-48);
    display: flex;
    justify-content: center;

    .no-results-message {
      text-align: center;
      padding: var(--size-32);
      border-radius: var(--border-radius-lg);
      background: var(--background-100);
      border: 1px solid var(--border-100);
      max-width: 400px;

      h3 {
        color: var(--foreground-100);
        margin-bottom: var(--size-12);
      }

      p {
        color: var(--foreground-200);
      }
    }
  }
}

/* Teaser feature tiles */
.price-paid-teaser {
  padding: var(--size-48) 0 var(--size-64);

  &__header {
    text-align: center;
    margin-bottom: var(--size-32);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-20);

    @media (min-width: 720px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__cta {
    margin-top: var(--size-32);
    display: flex;
    justify-content: center;
  }
}

@keyframes loading-shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
