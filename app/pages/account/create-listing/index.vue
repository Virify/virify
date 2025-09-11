<template>
  <!-- title -->
  <MoleculesAccountHeader :title="'Create a Listing'" />
  <!-- tier selection -->
  <OrganismsAccountCreateListingHero v-if="!tier" @create="handleCreateListing" />

  <AtomsAccountCardContainer v-if="tier && !confirmed">
    <div class="create-listing-confirmation">
      <h3 class="| title-sm">You selected the {{ tier?.tier }} tier</h3>
      <p class="| body-md">This tier is £{{ tier?.price }} per month.</p>
      <p class="| body-md">Proceed to create your listing with the {{ tier?.tier }} features.</p>
      <div class="create-listing-confirmation__actions">
        <button class="button button-sm button-tertiary" @click="tier = null">Back</button>
        <button class="button button-sm button-secondary" @click="handleContinue">Continue to payment</button>
      </div>
    </div>
  </AtomsAccountCardContainer>

  <AtomsAccountCardContainer v-if="paymentConfirmed && tier">
    <div class="create-listing-confirmation">
      <h3 class="| title-sm">Payment Successful!</h3>
      <p class="| body-md">Thank you for your payment. You are now able to start creating your listing.</p>
    </div>
  </AtomsAccountCardContainer>
</template>
<script setup lang="ts">
import ViewsDialogPayment from "~/components/views/Dialog/ViewsDialogPayment.vue";

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a Listing",
  },
  layout: "account",
});

const { showDialog } = useDialog();
const tier = ref<TierOption | null>(null);
const confirmed = ref<Boolean>(false);
const paymentConfirmed = ref<Boolean>(false);

const handleCreateListing = (selectedTier: TierOption) => {
  tier.value = selectedTier;
  console.log("Creating listing with tier:", selectedTier);
};

const handleContinue = async () => {
  showDialog({
    component: ViewsDialogPayment,
    props: {
      tier: tier.value
    },
    onClose: (result) => {
      const { returnValue } = result as { returnValue: { paymentConfirmed?: boolean; cancelled?: boolean } };
      
      if (returnValue.paymentConfirmed) {
        confirmed.value = true;
        paymentConfirmed.value = true;
        console.log("Payment successful!");
      } else if (returnValue.cancelled) {
        console.log("Payment cancelled");
      }
    }
  });
};
</script>

<style lang="scss">
.create-listing {
  &-confirmation {
    padding: var(--size-16);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--background-200);

    &__actions {
      margin-top: var(--size-24);
      display: flex;
      gap: var(--size-12);
    }
  }
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--background-300);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
