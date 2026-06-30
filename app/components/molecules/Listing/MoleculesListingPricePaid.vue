<template>
  <section class="price-paid">
    <h2 class="| title-md">Property History</h2>
    <p class="property-history-desc | r-body-md-sm">
      See when this property changed hands, how the price has moved, and how it stacks up
      against the rest of the city. Get a feel for its journey so far, spot local price
      trends, and find out if you’re looking at a hidden gem—or a record breaker. All data
      comes straight from the Land Registry, so you’re always in the know.
    </p>
    <div
      v-if="shouldShowPricePaidGrid"
      class="price-history-grid"
    >
      <!-- Property History Column -->
      <MoleculesTimeline
        title="This Property"
        :items="timelineItems"
        :loading="loading"
        empty-message="No Property History available"
        note="Note: This data is based on the latest available information provided by the Land Registry."
      />

      <!-- Market Context Column -->
      <div class="area-column">
        <h3 class="column-title | title-xs">{{ marketContextTitle }}</h3>
        <!-- Market context description moved to top of section -->
        <div
          v-if="hasMarketContext || loading"
          class="market-analytics"
        >
          <!-- Area Average Card -->
          <div
            class="stat-card-with-info"
            v-if="areaAverageCard || loading"
          >
            <MoleculesStatCard
              :title="areaAverageCard?.title || 'Loading...'"
              :value="areaAverageCard?.value || 'Loading...'"
              :description="areaAverageCard?.description || 'Loading description...'"
              :info="areaAverageInfo"
              :loading="loading"
              class="pill--percentage"
            />
          </div>

          <!-- Property Type Average Card -->
          <div
            class="stat-card-with-info"
            v-if="propertyTypeAverageCard || loading"
          >
            <MoleculesStatCard
              :title="propertyTypeAverageCard?.title || 'Loading...'"
              :value="propertyTypeAverageCard?.value || 'Loading...'"
              :description="
                propertyTypeAverageCard?.description || 'Loading description...'
              "
              :info="propertyTypeAverageInfo"
              :loading="loading"
              class="pill--percentage"
            />
          </div>

          <!-- Market Position Card -->
          <div
            class="stat-card-with-info"
            v-if="marketPositionCard || loading"
          >
            <MoleculesStatCard
              :title="marketPositionCard?.title || 'Loading...'"
              :value="marketPositionCard?.value || 'Loading...'"
              :description="marketPositionCard?.description || 'Loading description...'"
              :info="marketPositionInfo"
              :loading="loading"
              class="pill--percentage"
            />
          </div>

          <!-- Market Trend Card -->
          <div
            class="stat-card-with-info"
            v-if="marketTrendCard || loading"
          >
            <MoleculesStatCard
              :title="marketTrendCard?.title || 'Loading...'"
              :value="marketTrendCard?.value || 'Loading...'"
              :description="marketTrendCard?.description || 'Loading description...'"
              :info="marketTrendInfo"
              :loading="loading"
              class="pill--percentage"
            />
          </div>

          <!-- Info Modal -->
        </div>
        <div
          v-else
          class="market-analytics"
        >
          <MoleculesStatCard
            title="No Market Context available"
            value="Unavailable"
            description="We couldn't find enough Land Registry data for this address."
          />
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
      fullAddress?: string | null;
      street: string;
      city: string;
      postcode: string;
      county?: string | null;
    };
    price?: number;
    propertyType?: string;
  }

  const props = defineProps<Props>();

  const { pricePaidData, loading, fetchListingPricePaidData } = usePricePaidData();

  const hasRequestedPricePaidData = ref(false);

  const fetchPricePaidData = async () => {
    if (!props.listingId || !props.address) return;

    try {
      await fetchListingPricePaidData({
        listingId: props.listingId,
        address: props.address,
      });
    } catch {
      // The empty cards below cover unavailable price-paid data.
    } finally {
      hasRequestedPricePaidData.value = true;
    }
  };

  const hasLoadedPricePaidData = computed(
    () => hasRequestedPricePaidData.value && !loading.value,
  );
  const hasPricePaidData = computed(() => {
    const data = pricePaidData.value?.data;
    return Boolean(data?.sales?.length || data?.market_context);
  });
  const hasMarketContext = computed(() =>
    Boolean(pricePaidData.value?.data?.market_context),
  );
  const shouldShowPricePaidGrid = computed(
    () => loading.value || hasLoadedPricePaidData.value || hasPricePaidData.value,
  );
  const marketContextTitle = computed(() => {
    const referenceYear = pricePaidData.value?.data?.market_context?.reference_year;
    return referenceYear ? `Market Context (${referenceYear})` : "Market Context";
  });

  // Computed property for timeline items
  const timelineItems = computed(() => {
    const sales = pricePaidData.value?.data?.sales;
    if (!sales) return [];

    return sales.map((sale) => ({
      id: sale.transaction_id,
      title: `Price Sold: £${sale.price.toLocaleString()}`,
      date: sale.transfer_date,
      badge:
        sale.percentage_change !== null ?
          formatPercentageChange(sale.percentage_change)
        : undefined,
      badgeColor: "pill--percentage",
    }));
  });

  // Computed properties for market analytics cards
  const areaAverageCard = computed(() => {
    const marketContext = pricePaidData.value?.data?.market_context;
    const latestPrice = pricePaidData.value?.data?.sales?.[0]?.price || props.price;

    if (!marketContext?.area_average) return null;

    return {
      title: `Area Average: £${marketContext.area_average.toLocaleString()}`,
      value:
        latestPrice ? formatVsAverage(latestPrice, marketContext.area_average) : "N/A",
      description: `${marketContext.sample_size} sales this year`,
    };
  });

  const propertyTypeAverageCard = computed(() => {
    const marketContext = pricePaidData.value?.data?.market_context;
    const latestSale = pricePaidData.value?.data?.sales?.[0];
    const latestPrice = latestSale?.price || props.price;

    // Use prop property type if available and no sales data
    let typeName = "Property";
    if (latestSale?.property_type) {
      typeName = formatPropertyTypeName(latestSale.property_type);
    } else if (props.propertyType) {
      typeName = props.propertyType;
    }

    if (!marketContext?.property_type_average) return null;

    return {
      title: `${typeName} Average: £${marketContext.property_type_average.toLocaleString()}`,
      value:
        latestPrice ?
          formatVsAverage(latestPrice, marketContext.property_type_average)
        : "N/A",
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

  const areaAverageInfo =
    "Area Average: This is the average sale price for all properties in this area for the selected year (excluding this property). The percentage shown compares this property’s price to the area average.";
  const propertyTypeAverageInfo =
    "Property Type Average: This is the average sale price for properties of this type in this area for the selected year (excluding this property). The percentage shows how this property’s price compares to similar properties.";
  const marketPositionInfo =
    "Market Position: This shows how this property’s price ranks among all sales in the area for the year. For example, “Top 95%” means this property sold for more than 95% of local sales.";
  const marketTrendInfo =
    "Area Trend: This shows the percentage change in the average sale price for the area compared to the previous year.";
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
      background: var(--primary-400);
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
