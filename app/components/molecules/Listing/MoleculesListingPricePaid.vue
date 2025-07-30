<template>
  <section class="price-paid">
    <h2 class="| title-md">Property History</h2>
    <ol v-if="pricePaidData?.data?.sales" class="sales-timeline" reversed>
      <li v-for="sale in pricePaidData.data.sales" :key="sale.transaction_id" class="sale">
        <header class="sale__header">
          <h3 class="sale__price | title-xs">
            Price Sold: £{{ sale.price.toLocaleString() }}
            <AtomsPill v-if="sale.duration" class="pill pill--duration | body-xs">
              {{ formatDuration(sale.duration) }}
            </AtomsPill>
            <AtomsPill v-if="sale.property_type" class="pill pill--type | body-xs">
              {{ formatPropertyType(sale.property_type) }}
            </AtomsPill>
          </h3>
          <AtomsPill v-if="sale.percentage_change !== null" class="pill pill--percentage | body-xs">
            {{ formatPercentageChange(sale.percentage_change) }}
          </AtomsPill>
        </header>
        <time class="sale__date | body-sm" :datetime="sale.transfer_date"> Date Sold: {{ formatDate(sale.transfer_date) }} </time>
      </li>
    </ol>
    <p class="price-paid-note | body-xs">Note: This data is based on the latest available information provided by the Land Registry.</p>
  </section>
</template>

<script setup lang="ts">
interface Sale {
  price: number;
  transfer_date: string;
  transaction_id: string;
  old_new: string;
  duration: string;
  property_type: string;
  percentage_change: number | null;
}

interface PricePaidResponse {
  data: {
    sales: Sale[];
    total_sales: number;
    latest_sale: Sale;
    price_range: {
      min: number;
      max: number;
    } | null;
  } | null;
}

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

// Computed properties for formatting
const formatDuration = (duration: string): string => {
  const durationMap: Record<string, string> = {
    F: "Freehold",
    L: "Leasehold",
  };
  return durationMap[duration] || duration;
};

const formatPropertyType = (propertyType: string): string => {
  const typeMap: Record<string, string> = {
    D: "Detached",
    S: "Semi-Detached",
    T: "Terraced",
    F: "Flat",
    O: "Other",
  };
  return typeMap[propertyType] || propertyType;
};

const formatPercentageChange = (change: number): string => {
  return `${change > 0 ? "+" : ""}${change}%`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB");
};

onMounted(() => {
  fetchPricePaidData();
});
</script>
<style lang="scss">
.price-paid {
  margin: var(--size-32) 0;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
}

.sales-timeline {
  margin-top: var(--size-32);
  list-style: none;
  padding: 0;
  padding-left: var(--size-48);
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  position: relative;
}

.sale {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-lg);
  padding: var(--size-16);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;

  // Timeline ball
  &::before {
    content: "";
    position: absolute;
    left: calc(-1 * var(--size-48) + var(--size-6));
    top: var(--size-16);
    width: var(--size-16);
    height: var(--size-16);
    background-color: var(--secondary-400);
    border-radius: 50%;
    z-index: 2;
  }

  // Highlight first (most recent) item
  &:first-child::before {
    border: 3px solid var(--blue-400);
    left: calc(-1 * var(--size-48) + var(--size-6) - 3px);
    top: calc(var(--size-16) - 3px);
  }

  // Timeline connecting line
  &::after {
    content: "";
    position: absolute;
    left: calc(-1 * var(--size-48) + var(--size-14) - 1px);
    top: calc(var(--size-16) + var(--size-16));
    width: 2px;
    height: calc(100% + var(--size-16));
    background-color: var(--secondary-400);
    z-index: 1;
  }

  &:last-child::after {
    display: none;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--size-12);
    margin-bottom: var(--size-4);
  }

  &__price {
    flex: 1;
    margin: 0;
  }

  &__date {
    color: var(--foreground-200);
    display: block;
    margin: 0;
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

.price-paid-note {
  margin-top: var(--size-16);
  padding-left: var(--size-48);
}
</style>
