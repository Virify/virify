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

const { showDialog } = useDialog();
const { isMember, membershipType, membershipEndDate, isIncludedInMembership, requestMembershipUpgrade } = useUserMembership();

console.log("isMember", isMember.value);
console.log("membershipType", membershipType.value);
console.log("membershipEndDate", membershipEndDate.value);

const tierPrice = (tier: TierOption) => {
  if (isIncludedInMembership(tier)) {
    return 'Included with your membership';
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

const emit = defineEmits<{
  (e: "create", tier: TierOption): void;
  (e: "paymentRequested", tier: TierOption): void;
  (e: "upgradeRequested", tier: TierOption): void;
  (e: "paymentSuccess", tier: TierOption): void;
}>();

function createTier(tier: TierOption) {
  showTierConfirmation(tier);
}

function showTierConfirmation(tier: TierOption) {
  showDialog({
    component: ViewsDialogTierConfirmation,
    props: {
      tier: tier,
    },
    onClose: (result) => {
        const { returnValue } = result as { returnValue?: { action?: string; tier?: TierOption } };

        if (!returnValue) return;

        if (returnValue.action === 'create' && returnValue.tier) {
          // Tier is included in membership — create listing immediately
          emit('create', returnValue.tier);
          navigateTo('/account/create-listing');
          return;
        }

        if (returnValue.action === 'upgrade' && returnValue.tier) {
          // User needs to upgrade membership — placeholder flow
          // Emit event so parent consumers can react (analytics / UI)
          emit('upgradeRequested', returnValue.tier);
          requestMembershipUpgrade(returnValue.tier);
          return;
        }

        if (returnValue.action === 'payment' && returnValue.tier) {
          // Notify parent consumers and open payment dialog
          emit('paymentRequested', returnValue.tier);
          showPaymentDialog(returnValue.tier);
        } else if (returnValue.action === 'back') {
          // User went back, just close the dialog
          console.log('User went back to tier selection');
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
    onClose: (result) => {
      const { returnValue } = result as { returnValue?: { paymentConfirmed?: boolean; cancelled?: boolean; tier?: TierOption } };

      if (returnValue?.paymentConfirmed && returnValue.tier) {
        emit("paymentSuccess", returnValue.tier);
        console.log("Payment successful!");
      } else if (returnValue?.cancelled) {
        // User cancelled payment, show tier confirmation again
        showTierConfirmation(tier);
      }
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
