<template>
  <div class="price-paid | container">
    <AtomsHeroCard class="price-paid-hero">
      <h1 class="| title-lg">Price Paid Data</h1>
      <p class="| body-md">Enter a UK postcode and search</p>
      <div class="price-paid-hero__input">
        <input type="text" v-model="searchQuery" placeholder="Eg 'CF10 1AA'" class="| body-sm text-input" />
        <button class="| button button-secondary button-md" @click="search">Search</button>
      </div>
    </AtomsHeroCard>

    <div>
      <div v-if="results.length > 0">
        <h2 class="| title-xs">Results for "{{ searchQuery }}"</h2>
        <ul class="| list">
          <li v-for="(result, index) in results" :key="index" class="| list-item">
            <div class="| body-sm">
              <h3 class="| title-xs">{{ result.property_type_display }} at {{ result.full_address }}</h3>
              <p class="| body-xs text-muted">{{ result.duration_display }}</p>
              <ul class="| body-xs">
                <li v-for="(sale, saleIndex) in result.sales" :key="saleIndex" style="margin-bottom: 8px">
                  Sold for £{{ sale.price.toLocaleString() }} on {{ new Date(sale.transfer_date).toLocaleDateString() }}
                  <br />
                  <span class="| body-xs text-muted">Transaction ID: {{ sale.transaction_id }}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
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
  console.log("Search results:", results.value);
}
</script>
<style lang="scss" scoped>
.price-paid {
  margin: var(--size-64) auto;

  &-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: auto;
    width: max-content;

    &__input {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--size-8);
      margin-top: var(--size-8);
      border-radius: var(--border-radius-xl);
    }
  }
}
</style>
