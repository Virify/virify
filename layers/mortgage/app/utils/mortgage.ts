/**
 * Mortgage Calculator Client-Side Utilities
 */

import type {
  MortgageBuyerType,
  MortgageResult,
  BuyerTypeOption,
} from '~~/shared/types/mortgage'
import {
  BUYER_TYPE_OPTIONS,
  formatCurrency,
} from '~~/shared/types/mortgage'

export interface MortgageFormData {
  buyerType: MortgageBuyerType | null
  propertyPrice: number
  deposit: number
  termYears: number
}

export interface MortgageStep {
  id: string
  title: string
}

/**
 * Mortgage calculator steps
 */
export const MORTGAGE_STEPS: MortgageStep[] = [
  { id: 'buyer-type', title: 'What type of buyer are you?' },
  { id: 'property-price', title: 'What is the property price?' },
  { id: 'deposit', title: 'How much deposit do you have?' },
  { id: 'term', title: 'How long do you want your mortgage?' },
]

/**
 * Get the selected buyer type option
 */
export function getSelectedBuyerType(buyerType: MortgageBuyerType | null): BuyerTypeOption | undefined {
  return BUYER_TYPE_OPTIONS.find((opt: BuyerTypeOption) => opt.value === buyerType)
}

/**
 * Get minimum deposit percentage for a buyer type
 */
export function getMinDepositPercentage(buyerType: MortgageBuyerType | null): number {
  const selectedType = getSelectedBuyerType(buyerType)
  return selectedType?.minDeposit ?? 5
}

/**
 * Calculate deposit percentage
 */
export function calculateDepositPercentage(deposit: number, propertyPrice: number): number {
  if (propertyPrice <= 0) return 0
  return Math.round((deposit / propertyPrice) * 100 * 100) / 100
}

/**
 * Calculate LTV percentage
 */
export function calculateLtvPercentage(depositPercentage: number): number {
  return Math.round((100 - depositPercentage) * 100) / 100
}

/**
 * Validate deposit and return error message if invalid
 */
export function validateDeposit(
  deposit: number,
  propertyPrice: number,
  buyerType: MortgageBuyerType | null
): string | null {
  if (!buyerType || propertyPrice <= 0) return null
  
  const depositPercentage = calculateDepositPercentage(deposit, propertyPrice)
  const minDepositPercentage = getMinDepositPercentage(buyerType)
  
  if (depositPercentage < minDepositPercentage) {
    const minAmount = (propertyPrice * minDepositPercentage) / 100
    return `Minimum deposit required: ${formatCurrency(minAmount)} (${minDepositPercentage}%)`
  }
  
  if (depositPercentage > 95) {
    return 'Deposit cannot exceed 95% of property price'
  }
  
  return null
}

/**
 * Check if can proceed to next step
 */
export function canProceedToNextStep(
  currentStep: number,
  formData: MortgageFormData
): boolean {
  const depositError = validateDeposit(formData.deposit, formData.propertyPrice, formData.buyerType)
  
  switch (currentStep) {
    case 0:
      return formData.buyerType !== null
    case 1:
      return formData.propertyPrice > 0
    case 2:
      return formData.deposit > 0 && !depositError
    case 3:
      return formData.termYears > 0
    default:
      return false
  }
}

/**
 * Check if the entire form is valid
 */
export function isFormValid(formData: MortgageFormData): boolean {
  const depositError = validateDeposit(formData.deposit, formData.propertyPrice, formData.buyerType)
  
  return (
    formData.buyerType !== null &&
    formData.propertyPrice > 0 &&
    formData.deposit > 0 &&
    formData.termYears > 0 &&
    !depositError
  )
}

/**
 * Calculate interest percentage of total payment
 */
export function calculateInterestPercentage(result: MortgageResult | null): number {
  if (!result) return 0
  return Math.round((result.totalInterest / result.totalPayment) * 100)
}

/**
 * Get rate info string for tooltip
 */
export function getRateInfoString(result: MortgageResult): string {
  return `Rate: ${result.rate.toFixed(2)}% APR\nMonthly Payment: ${formatCurrency(result.monthlyPayment)}\nTotal over term: ${formatCurrency(result.totalPayment)}\nTotal interest: ${formatCurrency(result.totalInterest)}`
}

/**
 * Get default form data
 */
export function getDefaultFormData(): MortgageFormData {
  return {
    buyerType: null,
    propertyPrice: 0,
    deposit: 0,
    termYears: 25,
  }
}
