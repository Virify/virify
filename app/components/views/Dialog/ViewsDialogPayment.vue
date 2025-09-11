<template>
  <div class="| flow dialog-container dialog-container-sm">
    <h1 class="| title-xl">{{ dialogTitle }}</h1>
    <p v-if="!paymentSuccess" class="| body-sm"><span class="payment-dialog__tier">{{ tier?.tier }}</span> Tier - £{{ tier?.price }}/month</p>

    <div v-if="!paymentProcessing && !paymentSuccess" class="| flow flow-md">
      <div class="payment-dialog__form | flow flow-md">
        <AtomsInput
          v-model="cardNumber"
          type="text"
          placeholder="Card Number"
          autocomplete="cc-number"
          class="body-sm"
        />
        <div class="payment-dialog__form-row">
          <AtomsInput
            v-model="expiryDate"
            type="text"
            placeholder="MM/YY"
            autocomplete="cc-exp"
            class="body-sm"
          />
          <AtomsInput
            v-model="cvv"
            type="text"
            placeholder="CVV"
            autocomplete="cc-csc"
            class="body-sm"
          />
        </div>
        <AtomsInput
          v-model="cardholderName"
          type="text"
          placeholder="Cardholder Name"
          autocomplete="cc-name"
          class="body-sm"
        />
      </div>

      <div class="payment-dialog__actions">
        <AtomsButton
          type="button"
          @click="onCancel"
          class="| button-quiet"
          :disabled="paymentProcessing"
        >
          Cancel
        </AtomsButton>
        <AtomsButton
          type="button"
          @click="processPayment"
          class="| button-secondary"
          :disabled="paymentProcessing || !isFormValid"
        >
          Pay Now
        </AtomsButton>
      </div>
    </div>

    <div v-else-if="paymentProcessing" class="payment-dialog__processing">
      <div class="payment-dialog__spinner"></div>
      <p class="| body-sm">Processing payment...</p>
    </div>

    <div v-else-if="paymentSuccess" class="payment-dialog__success | flow flow-md">
      <p class="| body-md">Your payment has been processed successfully. You can now start creating your listing with the {{ tier?.tier }} tier features.</p>
      <p class="payment-dialog__success--message | body-sm">This dialog will close automatically...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tier: TierOption;
}>();

const { hideDialog } = useDialog();

// Payment form fields
const cardNumber = ref('');
const expiryDate = ref('');
const cvv = ref('');
const cardholderName = ref('');
const paymentProcessing = ref(false);
const paymentSuccess = ref(false);

// Reset dialog state when component is mounted/shown
onMounted(() => {
  resetDialogState();
});

// Form validation
const isFormValid = computed(() => {
  return cardNumber.value.trim() && 
         expiryDate.value.trim() && 
         cvv.value.trim() && 
         cardholderName.value.trim();
});

// Dynamic dialog title
const dialogTitle = computed(() => {
  if (paymentProcessing.value) {
    return 'Processing Payment';
  } else if (paymentSuccess.value) {
    return 'Payment Successful';
  } else {
    return 'Complete Payment';
  }
});

function onCancel() {
  hideDialog({ cancelled: true });
}

function onSuccessClose() {
  /**
   * TODO: Create a listing draft on the server here then navigate to the listing creation page
   */
  hideDialog({ 
    paymentConfirmed: true,
    tier: props.tier 
  });
  navigateTo('/account/create-listing');
}

function resetDialogState() {
  cardNumber.value = '';
  expiryDate.value = '';
  cvv.value = '';
  cardholderName.value = '';
  paymentProcessing.value = false;
  paymentSuccess.value = false;
}

function processPayment() {
  paymentProcessing.value = true;
  
  // Mock payment processing with 2 second timeout
  setTimeout(() => {
    paymentProcessing.value = false;
    paymentSuccess.value = true;
    
    // Auto close dialog after showing success message for 1.5 seconds
    setTimeout(() => {
      onSuccessClose();
    }, 3000);
  }, 3000);
}
</script>

<style lang="scss" scoped>
.payment-dialog {
  &__tier {
    text-transform: capitalize;
  }

  &__form {
    &-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-12);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--size-12);
  }

  &__processing {
    padding: var(--size-24) 0;
    text-align: center;
  }

  &__success {
    text-align: center;
    padding: var(--size-24) 0;

    &--message {
      padding: var(--size-16) 0;
    }
    
    h2 {
      margin: 0;
    }
  }

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--background-300);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
