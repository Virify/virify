<template>
  <div class="price-paid-page">
    <!-- Hero like the homepage -->
    <section class="price-paid-hero">
      <div class="container">
        <div class="price-paid-hero__content">
          <h1 class="title-2xl lineheight-xs">Price Paid Data</h1>
          <p class="body-lg">
            Real sold prices from HM Land Registry. Search by postcode to see sale histories and trends for any address.
          </p>
        </div>
      </div>
    </section>

    <!-- Form + results (unchanged) -->
    <div class="price-paid | container">
    <AtomsHeroCard class="price-paid__hero">
      <h1 class="| title-lg">Price Paid Data</h1>
      <p class="| body-md">Enter a UK postcode and search</p>
      <div class="price-paid__search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Eg 'CF10 1AA'" 
          class="| body-sm text-input"
          :disabled="loading"
          @keyup.enter="search"
        />
        <button 
          class="| button button-secondary button-md" 
          @click="search"
          :disabled="loading"
        >
          <span v-if="loading">Searching...</span>
          <span v-else>Search</span>
        </button>
      </div>
    </AtomsHeroCard>

    <div v-if="results.length > 0" class="price-paid__results">
      <ul class="price-paid__list">
        <li v-for="(result, index) in results" :key="index" class="price-paid__item">
          <MoleculesTimeline 
            :title="result.full_address"
            :type="result.property_type_display"
            :duration="result.duration_display"
            :items="formatTimelineItems(result.sales)"
          />
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
    </div>

    <!-- Feature tiles teaser (hidden once results load) -->
    <section
      v-if="!loading && !error && results.length === 0"
      class="price-paid-teaser"
    >
      <div class="container">
        <header class="price-paid-teaser__header">
          <h2 class="title-xl">What you can do with Price Paid data</h2>
          <p class="body-md max-width-prose">
            Explore recent sold prices, track local market momentum, and understand how a home’s value has changed over time. This is a preview of the tools we’re building.
          </p>
        </header>

        <div class="price-paid-teaser__grid">
          <MoleculesFeatureTile
            iconName="listings/savings"
            title="See sold history by address"
            subtitle="Every transaction, one place"
            description="Look up a property and see its full sale timeline with prices and transfer dates."
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="explore/trending"
            title="Track local trends"
            subtitle="Postcode-level insights"
            description="Understand price momentum in your area over the last 12–36 months."
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="explore/map"
            title="Map the neighbourhood"
            subtitle="Streets that set the tone"
            description="Spot streets and pockets that outperform the postcode average."
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="listings/property-type"
            title="Compare property types"
            subtitle="Flats vs houses"
            description="See how detached, semi, terrace, and flats differ in both price and velocity."
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="search"
            title="Verify asking prices"
            subtitle="Reality check"
            description="Sense‑check current listings against actual sold prices nearby."
            variant="blue"
          />

          <MoleculesFeatureTile
            iconName="content/info"
            title="Timing the move"
            subtitle="Seasonality & cycles"
            description="See when sales cluster and how that affects negotiation power."
            variant="blue"
          />
        </div>

        <div class="price-paid-teaser__cta">
          <NuxtLink to="/waiting-list" class="button button-lg button-monochrome">Join the waiting list</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
const searchQuery = ref<string>("");
const results = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function search() {
  if (searchQuery.value.trim() === "") {
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const formattedQuery = searchQuery.value.trim();
    const response = await $fetch<any>("/api/price-paid/", {
      method: "POST",
      body: { postcode: formattedQuery },
    });
    results.value = response.data;
  } catch (err) {
    console.error("Error searching price paid data:", err);
    error.value = "Failed to search price paid data. Please try again.";
    results.value = [];
  } finally {
    loading.value = false;
  }
}


function formatTimelineItems(sales: any[]) {
  return sales.map(sale => ({
    id: sale.transaction_id,
    title: `Price Sold: £${sale.price.toLocaleString()}`,
    date: sale.transfer_date,
  }));
}
</script>
<style lang="scss" scoped>
.price-paid-page {
  background: var(--background-100);
}

.price-paid-hero {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  padding: var(--size-80) var(--size-32) var(--size-64);
  display: flex;
  align-items: center;
  justify-content: center;

  .price-paid-hero__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: var(--size-64) 0;
  }
}

.price-paid {
  padding: var(--size-32) 0;

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: auto;
    width: max-content;
  }

  &__search {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--size-8);
    margin-top: var(--size-8);
    border-radius: var(--border-radius-xl);
  }

  &__results {
    margin-top: var(--size-48);
  }

  &__list {
    margin-top: var(--size-32);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-48);
    list-style: none;
    padding: 0;
  }

  &__item {
    width: 100%;
    max-width: 800px;
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
      background: linear-gradient(90deg, 
        var(--background-300) 25%, 
        var(--background-200) 50%, 
        var(--background-300) 75%
      );
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
      background: var(--background-200);
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

    @media (min-width: 720px) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
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
