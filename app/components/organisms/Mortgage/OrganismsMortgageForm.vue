<template>
  <AtomsHeroCard class="o-mortgage-form">
    <!-- Title -->
    <h2 class="o-mortgage-form__title | title-md">Mortgage Calculator</h2>

    <!-- Form Fields -->
    <div class="o-mortgage-form__fields">
      <!-- Buyer Type -->
      <div class="o-mortgage-form__field">
        <label class="o-mortgage-form__label | body-sm text-medium">Buyer Type</label>
        <MoleculesMortgageBuyerTypeSelector :options="buyerTypeOptions" :model-value="formData.buyerType"
          @update:model-value="updateFormField('buyerType', $event as MortgageBuyerType)" />
      </div>

      <!-- Repayment Type -->
      <div class="o-mortgage-form__field">
        <label class="o-mortgage-form__label | body-sm text-medium">Repayment Type</label>
        <div class="o-mortgage-form__repayment-options">
          <AtomsMortgageRadioOption
            value="REPAYMENT"
            :model-value="formData.repaymentType"
            label="Repayment"
            description="Pay off interest and capital each month"
            name="repayment-type"
            @update:model-value="updateFormField('repaymentType', $event as MortgageRepaymentType)"
          />
          <AtomsMortgageRadioOption
            value="INTEREST_ONLY"
            :model-value="formData.repaymentType"
            label="Interest Only"
            description="Pay interest only — capital remains outstanding at end of term"
            name="repayment-type"
            @update:model-value="updateFormField('repaymentType', $event as MortgageRepaymentType)"
          />
        </div>
        <p v-if="formData.repaymentType === 'INTEREST_ONLY'" class="o-mortgage-form__help | body-xs">
          With interest-only, your monthly payments are lower but you'll need to repay the full loan amount separately at the end of the term.
        </p>
      </div>

      <!-- Property Price & Deposit Row -->
      <div class="o-mortgage-form__row">
        <div class="o-mortgage-form__field o-mortgage-form__field--half">
          <label class="o-mortgage-form__label | body-sm text-medium">Property Price</label>
          <AtomsCurrencyInput id="property-price" :model-value="formData.propertyPrice || undefined" placeholder="£0"
            :disabled="!formData.buyerType" @update:model-value="updateFormField('propertyPrice', $event || 0)" />
          <p class="o-mortgage-form__help | body-xs">The full purchase price of the property.</p>
        </div>

        <div class="o-mortgage-form__field o-mortgage-form__field--half">
          <label class="o-mortgage-form__label | body-sm text-medium">Deposit</label>
          <AtomsCurrencyInput id="deposit" :model-value="formData.deposit || undefined" placeholder="£0"
            :disabled="!formData.buyerType" @update:model-value="updateFormField('deposit', $event || 0)" />
          <p class="o-mortgage-form__help | body-xs">The amount you'll pay upfront.</p>
        </div>
      </div>

      <!-- LTV Explanation -->
      <div v-if="formData.propertyPrice > 0 && formData.deposit > 0" class="o-mortgage-form__ltv-info">
        <div class="o-mortgage-form__ltv-summary | body-sm">
          <strong>{{ depositPercentage }}%</strong> deposit · <strong>{{ ltvPercentage }}%</strong> LTV
        </div>
        <p class="o-mortgage-form__ltv-explainer | body-xs">
          LTV (Loan-to-Value) is the percentage of the property you're borrowing.
          Lower LTV typically means better rates as it's less risky for lenders.
        </p>
      </div>
      <div v-if="depositError" class="o-mortgage-form__error | body-xs">
        {{ depositError }}
      </div>

      <!-- Term & Interest Rate Row -->
      <div class="o-mortgage-form__row">
        <div class="o-mortgage-form__field o-mortgage-form__field--half">
          <label class="o-mortgage-form__label | body-sm text-medium">Mortgage Term</label>
          <div class="o-mortgage-form__term-inputs">
            <div class="o-mortgage-form__term-input">
              <AtomsMortgageNumberInput id="term-years" :model-value="formData.termYears || undefined" :min="0"
                :max="40" placeholder="25" :disabled="!priceAndDepositFilled"
                @update:model-value="updateFormField('termYears', $event || 0)" />
              <span class="| body-sm">years</span>
            </div>
            <div class="o-mortgage-form__term-input">
              <AtomsMortgageNumberInput id="term-months" :model-value="formData.termMonths || undefined" :min="0"
                :max="11" placeholder="0" :disabled="!priceAndDepositFilled"
                @update:model-value="updateFormField('termMonths', $event || 0)" />
              <span class="| body-sm">months</span>
            </div>
          </div>
          <p class="o-mortgage-form__help | body-xs">
            <template v-if="totalTermDisplay">Total: {{ totalTermDisplay }}</template>
            <template v-else>Most mortgages are 25–35 years. Shorter terms mean higher payments but less interest
              overall.</template>
          </p>
        </div>

        <div class="o-mortgage-form__field o-mortgage-form__field--half">
          <label class="o-mortgage-form__label | body-sm text-medium">
            Interest Rate <span class="o-mortgage-form__optional">(optional)</span>
          </label>
          <div class="o-mortgage-form__rate-input">
            <AtomsMortgageNumberInput id="custom-rate" :model-value="formData.customInterestRate ?? undefined" :min="0"
              :max="15" :step="0.01" placeholder="e.g. 4.5" :disabled="!priceAndDepositFilled"
              @update:model-value="updateFormField('customInterestRate', $event || null)" />
            <span class="| body-sm">%</span>
          </div>
          <p class="o-mortgage-form__help | body-xs">
            Enter a rate from your lender/broker, or leave blank to see average UK rates.
          </p>
        </div>
      </div>
    </div>

    <!-- Calculate Button -->
    <AtomsButton :disabled="!formValid || isCalculating" :loading="isCalculating" variant="secondary" size="lg"
      class="o-mortgage-form__submit" @click="$emit('calculate')">
      {{ isCalculating ? 'Calculating...' : 'Calculate' }}
    </AtomsButton>
  </AtomsHeroCard>
</template>

<script setup lang="ts">

interface Props {
  formData: MortgageFormData
  calculationResult: MortgageCalculationData | null
  isCalculating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCalculating: false,
})

const emit = defineEmits<{
  'update:formData': [data: MortgageFormData]
  'calculate': []
}>()

const buyerTypeOptions = BUYER_TYPE_OPTIONS.map((opt: BuyerTypeOption) => ({
  value: opt.value,
  key: opt.key,
  info: opt.info,
}))

// Computed values
const depositPercentage = computed(() =>
  calculateDepositPercentage(props.formData.deposit, props.formData.propertyPrice)
)

const ltvPercentage = computed(() =>
  calculateLtvPercentage(depositPercentage.value)
)

const depositError = computed(() =>
  validateDeposit(props.formData.deposit, props.formData.propertyPrice, props.formData.buyerType)
)

const priceAndDepositFilled = computed(() =>
  !!props.formData.buyerType &&
  props.formData.propertyPrice > 0 &&
  props.formData.deposit > 0 &&
  !depositError.value
)

const formValid = computed(() =>
  isFormValid(props.formData)
)

const totalTermDisplay = computed(() => {
  const years = props.formData.termYears
  const months = props.formData.termMonths
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`)
  }
  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? 's' : ''}`)
  }

  // Show informational text when no term entered
  if (parts.length === 0) {
    return null
  }

  const totalMonths = getTotalTermMonths(props.formData)
  if (totalMonths < 60) {
    return `${parts.join(' ')} (minimum 5 years)`
  }
  if (totalMonths > 480) {
    return `${parts.join(' ')} (maximum 40 years)`
  }

  return parts.join(' ')
})

// Methods
function updateFormField<K extends keyof MortgageFormData>(
  field: K,
  value: MortgageFormData[K]
) {
  emit('update:formData', {
    ...props.formData,
    [field]: value,
  })
}
</script>

<style lang="scss" scoped>
.o-mortgage-form {
  width: 100%;
  align-items: stretch;
  text-align: left;

  &__title {
    margin-bottom: var(--size-16);
    text-align: center;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    width: 100%;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-16);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--size-6);

    &--half {
      flex: 1 1 200px;
    }
  }

  &__label {
    color: var(--monochrome-900);
  }

  &__optional {
    opacity: 0.6;
    font-weight: normal;
  }

  &__ltv-info {
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    padding: var(--size-12);
    margin-top: calc(var(--size-8) * -1);
  }

  &__ltv-summary {
    color: var(--success-500);
    margin-bottom: var(--size-4);
  }

  &__ltv-explainer {
    opacity: 0.8;
    margin: 0;
  }

  &__error {
    color: var(--error-color, #ef4444);
  }

  &__term-inputs {
    display: flex;
    gap: var(--size-16);
    width: 100%;
  }

  &__term-input {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    flex: 1;

    input {
      flex: 1;
    }
  }

  &__rate-input {
    display: flex;
    align-items: center;
    gap: var(--size-8);
  }

  &__repayment-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--size-8);
    width: 100%;
    align-items: stretch;

    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
  }

  &__help {
    opacity: 0.7;
    margin: 0;
  }

  &__submit {
    width: 100%;
  }

  .button {
    margin-top: var(--size-24);
    margin-bottom: 0;
  }
}
</style>
