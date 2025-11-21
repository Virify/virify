<template>
  <div class="create-listing-hero">
    <AtomsAriaTooltip 
      v-for="tier in tiers" 
      :key="tier.tier"
      :id="tier.tier"
      content="Click to see tier features and details"
    >
      <AtomsStatsCard 
        :value="tier.tier" 
        title="Create Listing" 
        :subtitle="tierPrice(tier)" 
        :animated="true" 
        :tier="tier.tier"
        :aria-label="`Create a ${tier.tier} listing`"
        @click.prevent="createTier(tier)" 
      />
    </AtomsAriaTooltip>
  </div>
</template>

<script setup lang="ts">
import ViewsDialogTierConfirmation from "~/components/views/Dialog/ViewsDialogTierConfirmation.vue";
import ViewsDialogPayment from "~/components/views/Dialog/ViewsDialogPayment.vue";
import ViewsDialogPropertyOwnership from "~~/layers/verification/app/components/views/Dialog/ViewsDialogPropertyOwnership.vue";

const { showDialog } = useDialog();
const { isIncludedInMembership, requestMembershipUpgrade } = useUserMembership();
const { createDraftListing } = useListingEdit();

const tierPrice = (tier: TierOption) => {
  if (isIncludedInMembership(tier)) {
    return 'Included in your membership';
  }

  return formattedPrice(tier.price) + ' / month';
};

const tiers: TierOption[] = [
  { tier: "basic", price: 12.99, rank: 0 },
  { tier: "featured", price: 24.99, rank: 1 },
  { tier: "premium", price: 49.99, rank: 2 },
];

const formattedPrice = (price: number) => {
  return `£${price.toFixed(2)}`;
};


function createTier(tier: TierOption) {
  showTierConfirmation(tier);
}

function showTierConfirmation(tier: TierOption) {
  showDialog({
    component: ViewsDialogTierConfirmation,
    props: {
      tier: tier,
    },
    onClose: async (result) => {
        const { returnValue } = result as { returnValue?: { action?: string; tier?: TierOption } };

        if (!returnValue) return;

        if (returnValue.action === 'create' && returnValue.tier) {
          try {
            // const draftId = await createDraftListing(returnValue.tier);
            // TODO: Create a verification flow involving uploading a deeds document and creating an address
            // After the deed is uploaded and address created, send an email to validate ownership
            // After the email is validated, allow the user to proceed with listing creation
            verifyOwnershipDialog(returnValue.tier);
            // Navigate directly to the stepper instead of the dashboard
            // navigateTo(`/account/create-listing/${draftId}`);
          } catch (error) {
            // Error already handled in createDraftListing
            console.error('Failed to create draft listing:', error);
          }
        }

        if (returnValue.action === 'upgrade' && returnValue.tier) {
          // User needs to upgrade membership — placeholder flow
          requestMembershipUpgrade(returnValue.tier);
          return;
        }

        if (returnValue.action === 'payment' && returnValue.tier) {
          showPaymentDialog(returnValue.tier);
        }
    },
  });
}

function showPaymentDialog(tier: TierOption) {
  showDialog({
    component: ViewsDialogPayment,
    props: {
      tier: tier,
    },
    onClose: async (result) => {
      const { returnValue } = result as { returnValue?: { paymentConfirmed?: boolean; cancelled?: boolean; tier?: TierOption } };

      if (returnValue?.paymentConfirmed && returnValue.tier) {
        try {
          const draftId = await createDraftListing(returnValue.tier);
          // Navigate directly to the stepper instead of the dashboard  
          navigateTo(`/account/create-listing/${draftId}`);
        } catch (error) {
          // Error already handled in createDraftListing
          console.error('Failed to create draft listing:', error);
        }
      } else if (returnValue?.cancelled) {
        showTierConfirmation(tier);
      }
    },
  });
}

function verifyOwnershipDialog(tier: TierOption) {
  showDialog({
    component: ViewsDialogPropertyOwnership,
    props: {
      tier: tier,
    },
    onClose: () => {
      // Navigate directly to the stepper instead of the dashboard
      // navigateTo(`/account/create-listing/${draftId}`);
    },
  });
}
</script>

<style scoped lang="scss">
.create-listing {
  &-hero {
    display: grid;
    gap: var(--size-16);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    text-transform: capitalize;

    & > * {
      cursor: pointer;
    }
  }
}

.create-listing-info {
  padding: var(--size-16);
}
</style>
