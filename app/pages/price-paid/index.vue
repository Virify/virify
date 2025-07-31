<template>
  <div class="price-paid | container">
    <AtomsHeroCard class="price-paid__hero">
      <h1 class="| title-lg">Price Paid Data</h1>
      <p class="| body-md">Enter a UK postcode and search</p>
      <div class="price-paid__search">
        <input type="text" v-model="searchQuery" placeholder="Eg 'CF10 1AA'" class="| body-sm text-input" />
        <button class="| button button-secondary button-md" @click="search">Search</button>
      </div>
    </AtomsHeroCard>

    <div v-if="results.length > 0" class="price-paid__results">
      <h2 class="| title-md">Results for "{{ searchQuery }}"</h2>
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
  </div>
</template>
<script lang="ts" setup>
const searchQuery = ref<string>("");
const results = ref<any[]>([]);

async function search() {
  if (searchQuery.value.trim() === "") {
    return;
  }
  const formattedQuery = searchQuery.value.trim();
  const response = await $fetch<any>("/api/price-paid/", {
    method: "POST",
    body: { postcode: formattedQuery },
  });
  results.value = response.data;
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
  margin: var(--size-64) auto;

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
}
</style>
