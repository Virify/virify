<template>
  <div class="create-listing-hero">
    <AtomsStatsCard 
      v-for="tier in tiers" 
      :key="tier.tier"
      :value="tier.tier" 
      title="Create Listing" 
      :subtitle="formattedPrice(tier.price) + ' / month'"
      :animated="true" 
      :tier="tier.tier"
      @click.prevent="createTier(tier)"
    />
  </div>
</template>

<script setup lang="ts">
import ViewsDialogTierConfirmation from "~/components/views/Dialog/ViewsDialogTierConfirmation.vue";
import ViewsDialogPayment from "~/components/views/Dialog/ViewsDialogPayment.vue";

const { showDialog } = useDialog();

const tiers: TierOption[] = [
  { tier: 'basic', price: 12.99 },
  { tier: 'featured', price: 24.99 },
  { tier: 'premium', price: 49.99 },
];

const formattedPrice = (price: number) => {
  return `£${price.toFixed(2)}`;
};

const emit = defineEmits<{
  (e: 'create', tier: TierOption): void;
  (e: 'paymentSuccess', tier: TierOption): void;
}>()

function createTier(tier: TierOption) {
  showTierConfirmation(tier);
}

function showTierConfirmation(tier: TierOption) {
  showDialog({
    component: ViewsDialogTierConfirmation,
    props: {
      tier: tier
    },
    onClose: (result) => {
      const { returnValue } = result as { returnValue: { action?: string; tier?: TierOption } };
      
      if (returnValue.action === 'continue' && returnValue.tier) {
        showPaymentDialog(returnValue.tier);
      } else if (returnValue.action === 'back') {
        // User went back, just close the dialog
        console.log("User went back to tier selection");
      }
    }
  });
}

function showPaymentDialog(tier: TierOption) {
  showDialog({
    component: ViewsDialogPayment,
    props: {
      tier: tier
    },
    onClose: (result) => {
      const { returnValue } = result as { returnValue: { paymentConfirmed?: boolean; cancelled?: boolean; tier?: TierOption } };
      
      if (returnValue.paymentConfirmed && returnValue.tier) {
        emit('paymentSuccess', returnValue.tier);
        console.log("Payment successful!");
      } else if (returnValue.cancelled) {
        // User cancelled payment, show tier confirmation again
        showTierConfirmation(tier);
      }
    }
  });
}
</script>

<style scoped lang="scss">
.create-listing-hero {
  display: grid;
  gap: var(--size-16);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  text-transform: capitalize;
  
  & > * {
    cursor: pointer;
  }
}
</style>