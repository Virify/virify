<template>
  <section>
    <h2 class="| title-md">Property History</h2>
  </section>
  <pre class="| body-xs">{{ pricePaidData }}</pre>
</template>

<script setup lang="ts">
interface Sale {
  price: number
  transfer_date: string
  transaction_id: string
  is_new_build: boolean
  percentage_change: number | null
}

interface PricePaidResponse {
  data: {
    sales: Sale[]
    total_sales: number
    latest_sale: Sale
    price_range: {
      min: number
      max: number
    } | null
  } | null
}

interface Props {
  listingId: number
  address: {
    number?: string | null
    flat?: string | null
    street: string
    city: string
    postcode: string
    county?: string | null
  }
}

const props = defineProps<Props>()

const pricePaidData = ref<PricePaidResponse | null>(null)
const loading = ref(false)
const error = ref(false)

const fetchPricePaidData = async () => {
  if (!props.listingId || !props.address) return
  
  loading.value = true
  error.value = false
  
  try {
    const response = await $fetch<PricePaidResponse>('/api/price-paid/' + props.listingId, {
      method: 'POST',
      body: {
        listingId: props.listingId,
        address: props.address
      }
    })
    
    pricePaidData.value = response
  } catch (err) {
    console.error('Error fetching price paid data:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPricePaidData()
})
</script>