<template>
  <div class="tier-confirmation | flow dialog-container dialog-container-sm">
    <h1 class="tier-confirmation__title | title-md">Confirm Your Selection</h1>

    <AtomsDivider />
    
    <div class=" | flow flow-md">
      <div class="tier-confirmation__header">
        <h3 class="| title-xs">You have selected the {{ tier?.tier }} tier</h3>
        <p class="| body-md">This tier is <em><strong>{{ tierPrice }}</strong></em></p>
      </div>

      <AtomsDivider />

      <div class="tier-confirmation__features">
        <h4 class="tier-confirmation__features--title | title-xs">Features: </h4>

        <Transition name="tier-features" mode="out-in">
          <ul :key="tier?.tier" class="tier-features-list">
            <li v-for="feature in currentTierFeatures" :key="feature" class="tier-feature-item">
              <AtomsIcon icon="tick-solid" size="24" class="tier-feature-icon" />
              <span class="| body-sm">{{ feature }}</span>
            </li>
          </ul>
        </Transition>
      </div>

      <div class="tier-confirmation__actions">
        <AtomsButton
          type="button"
          @click="onBack"
          class="| button-quiet"
        >
          Back
        </AtomsButton>
        <AtomsButton
          type="button"
          @click="onContinue"
          class="| button-secondary"
        >
          {{ primaryActionLabel }}
        </AtomsButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  tier: TierOption;
}>();

const { hideDialog } = useDialog();
const { isIncludedInMembership, needsMembershipUpgrade } = useUserMembership();

const currentTierFeatures = computed(() => {
  return props.tier ? getTierFeatures(props.tier.tier) : [];
});

const tierPrice = computed(() => {
  return isIncludedInMembership(props.tier) ? 'Included with your membership' : `£${props.tier.price.toFixed(2)} / month`;
});

const primaryActionLabel = computed(() => {
  if (isIncludedInMembership(props.tier)) return 'Create Listing';
  if (needsMembershipUpgrade(props.tier)) return 'Upgrade Membership';
  return 'Continue to payment';
});

function onBack() {
  hideDialog({ action: 'back' });
}

function onContinue() {
  // If the tier is included in their membership, skip payment and create listing immediately
  if (isIncludedInMembership(props.tier)) {
    hideDialog({ action: 'create', tier: props.tier });
    return;
  }

  // If user's membership rank is lower than required, offer upgrade
  if (needsMembershipUpgrade(props.tier)) {
    hideDialog({ action: 'upgrade', tier: props.tier });
    return;
  }

  // Otherwise, proceed to payment
  hideDialog({ action: 'payment', tier: props.tier });
}
</script>

<style lang="scss" scoped>
.tier-confirmation {
  &__title {
    color: var(--secondary-400);
  }
  
  &__features {
    margin: var(--size-16) 0;
    max-height: 35dvh;
    overflow: auto;
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;

    &--title {
      color: var(--secondary-400);
      margin-bottom: var(--size-8);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--size-12);
    margin-top: var(--size-24);
  }
}

.tier-features {
  &-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }

  &-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  &-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
}

.tier-feature {
  &-item {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-4) 0;
  }

  &-icon {
    color: var(--secondary-400);
    flex-shrink: 0;
  }
}
</style>
