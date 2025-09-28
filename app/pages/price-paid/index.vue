<template>
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

@keyframes loading-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
