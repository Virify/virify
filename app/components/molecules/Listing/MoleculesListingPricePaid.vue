<template>
  <section class="price-paid">
    <h2 class="| title-md">Property History</h2>
    <p class="property-history-desc | body-md">
      See when this property changed hands, how the price has moved, and how it stacks up against the rest of the city. Get a feel for its journey so far, spot local price trends, and find out if you’re looking at a hidden gem—or a record breaker. All data comes straight from the Land Registry, so you’re always in the know.
    </p>
    <div v-if="pricePaidData?.data?.sales" class="price-history-grid">
      <!-- Property History Column -->
      <MoleculesTimeline title="This Property" :items="timelineItems" note="Note: This data is based on the latest available information provided by the Land Registry." />

      <!-- Market Context Column -->
      <div class="area-column" v-if="pricePaidData?.data?.market_context">
        <h3 class="column-title | title-xs">Market Context ({{ pricePaidData?.data?.market_context?.reference_year }})</h3>
        <!-- Market context description moved to top of section -->
        <div class="market-analytics">
          <!-- Area Average Card -->
          <div class="stat-card-with-info" v-if="areaAverageCard">
            <MoleculesStatCard :title="areaAverageCard.title" :value="areaAverageCard.value" :description="areaAverageCard.description" :info="areaAverageInfo" class="pill--percentage" />
          </div>

          <!-- Property Type Average Card -->
          <div class="stat-card-with-info" v-if="propertyTypeAverageCard">
            <MoleculesStatCard :title="propertyTypeAverageCard.title" :value="propertyTypeAverageCard.value" :description="propertyTypeAverageCard.description" :info="propertyTypeAverageInfo" class="pill--percentage" />
          </div>

          <!-- Market Position Card -->
          <div class="stat-card-with-info" v-if="marketPositionCard">
            <MoleculesStatCard :title="marketPositionCard.title" :value="marketPositionCard.value" :description="marketPositionCard.description" :info="marketPositionInfo" class="pill--percentage" />
          </div>

          <!-- Market Trend Card -->
          <div class="stat-card-with-info" v-if="marketTrendCard">
            <MoleculesStatCard :title="marketTrendCard.title" :value="marketTrendCard.value" :description="marketTrendCard.description" :info="marketTrendInfo" class="pill--percentage" />
          </div>

          <!-- Info Modal -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  listingId: number;
  address: {
    number?: string | null;
    flat?: string | null;
    street: string;
    city: string;
    postcode: string;
    county?: string | null;
  };
}

const props = defineProps<Props>();

const pricePaidData = ref<PricePaidResponse | null>(null);
const loading = ref(false);
const error = ref(false);

const fetchPricePaidData = async () => {
  if (!props.listingId || !props.address) return;

  loading.value = true;
  error.value = false;

  try {
    const response = await $fetch<PricePaidResponse>("/api/price-paid/" + props.listingId, {
      method: "POST",
      body: {
        listingId: props.listingId,
        address: props.address,
      },
    });

    pricePaidData.value = response;
  } catch (err) {
    console.error("Error fetching price paid data:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// Computed property for timeline items
const timelineItems = computed(() => {
  const sales = pricePaidData.value?.data?.sales;
  if (!sales) return [];

  return sales.map((sale) => ({
    id: sale.transaction_id,
    title: `Price Sold: £${sale.price.toLocaleString()}`,
    date: sale.transfer_date,
    badge: sale.percentage_change !== null ? formatPercentageChange(sale.percentage_change) : undefined,
    badgeColor: "pill--percentage",
  }));
});

// Computed properties for market analytics cards
const areaAverageCard = computed(() => {
  const marketContext = pricePaidData.value?.data?.market_context;
  const latestPrice = pricePaidData.value?.data?.sales?.[0]?.price;

  if (!marketContext?.area_average || !latestPrice) return null;

  return {
    title: `Area Average: £${marketContext.area_average.toLocaleString()}`,
    value: formatVsAverage(latestPrice, marketContext.area_average),
    description: `${marketContext.sample_size} sales this year`,
  };
});

const propertyTypeAverageCard = computed(() => {
  const marketContext = pricePaidData.value?.data?.market_context;
  const latestSale = pricePaidData.value?.data?.sales?.[0];

  if (!marketContext?.property_type_average || !latestSale?.price || !latestSale?.property_type) return null;

  return {
    title: `${formatPropertyTypeName(latestSale.property_type)} Average: £${marketContext.property_type_average.toLocaleString()}`,
    value: formatVsAverage(latestSale.price, marketContext.property_type_average),
    description: `${marketContext.property_type_sample_size} similar properties`,
  };
});

const marketPositionCard = computed(() => {
  const percentile = pricePaidData.value?.data?.market_context?.percentile;

  if (percentile === null || percentile === undefined) return null;

  return {
    title: "Market Position",
    value: `Top ${100 - percentile}%`,
    description: `Above ${percentile}% of local properties`,
  };
});

const marketTrendCard = computed(() => {
  const yearlyTrend = pricePaidData.value?.data?.market_context?.yearly_trend;

  if (yearlyTrend === null || yearlyTrend === undefined) return null;

  return {
    title: "Area Trend",
    value: formatTrend(yearlyTrend),
    description: "Year-over-year change",
  };
});

onMounted(() => {
  fetchPricePaidData();
});

const areaAverageInfo = "Area Average: This is the average sale price for all properties in this area for the selected year (excluding this property). The percentage shown compares this property’s price to the area average.";
const propertyTypeAverageInfo =
  "Property Type Average: This is the average sale price for properties of this type in this area for the selected year (excluding this property). The percentage shows how this property’s price compares to similar properties.";
const marketPositionInfo = "Market Position: This shows how this property’s price ranks among all sales in the area for the year. For example, “Top 95%” means this property sold for more than 95% of local sales.";
const marketTrendInfo = "Area Trend: This shows the percentage change in the average sale price for the area compared to the previous year.";
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
.price-paid {

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.price-history-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-16);
  margin-top: var(--size-32);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--size-24);
  }
}

.column-title {
  margin: 0 0 var(--size-16) 0;
  color: var(--foreground-100);
}

.area-column {
  .market-analytics {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
  }
}

.pill {
  color: var(--monochrome-900);
  padding: var(--size-4) var(--size-8);

  &--percentage {
    background: var(--blue-400);
  }

  &--duration,
  &--type {
    background: var(--secondary-400);
    margin-left: var(--size-8);
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    transform: translateY(-1px);

    @media (max-width: 640px) {
      display: none;
    }
  }
}
</style>
