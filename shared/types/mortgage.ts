/**
 * Mortgage Calculator Types
 */

export type MortgageRateType = 
  | 'FIXED_2_YEAR'
  | 'FIXED_3_YEAR'
  | 'FIXED_5_YEAR'
  | 'FIXED_10_YEAR'
  | 'VARIABLE'
  | 'TRACKER'

export type MortgageBuyerType = 
  | 'FIRST_TIME_BUYER'
  | 'HOME_MOVER'
  | 'BUY_TO_LET'
  | 'REMORTGAGE'

export type MortgageRepaymentType =
  | 'REPAYMENT'
  | 'INTEREST_ONLY'

export type MortgageLtvBracket = 
  | 'LTV_60'
  | 'LTV_75'
  | 'LTV_85'
  | 'LTV_90'
  | 'LTV_95'

export interface MortgageRate {
  id: number
  rateType: MortgageRateType
  buyerType: MortgageBuyerType
  ltvBracket: MortgageLtvBracket
  rate: number
  fetchedAt: string
  validFrom: string
  validUntil: string | null
  source: string
}

export interface MortgageCalculationRequest {
  propertyPrice: number
  deposit: number
  termYears?: number
  buyerType: MortgageBuyerType
  rateType?: MortgageRateType
  repaymentType?: MortgageRepaymentType
}

export interface MortgageResult {
  rateType: string
  rate: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  loanAmount: number
}

export interface MortgageCalculationData {
  propertyPrice: number
  deposit: number
  depositPercentage: number
  loanAmount: number
  ltv: number
  ltvBracket: string
  termYears: number
  buyerType: string
  repaymentType: MortgageRepaymentType
  results: MortgageResult[]
  usingDefaultRates: boolean
  usingCustomRate?: boolean
  ratesLastUpdated: string | null
}

export interface MortgageCalculationResponse {
  success: boolean
  data: MortgageCalculationData
}

export interface MortgageRatesResponse {
  success: boolean
  data: MortgageRate[]
  message?: string
  fetchedAt?: string
}

export interface BuyerTypeOption {
  value: MortgageBuyerType
  key: string
  info: string
  minDeposit: number
}

export interface RateTypeOption {
  value: MortgageRateType
  key: string
  info: string
}

export interface TermOption {
  value: number
  key: string
}

/**
 * Payload for tracking mortgage calculations via analytics
 */
export interface TrackMortgageCalculationPayload {
  listingId?: string | null
  propertyPrice: number
  deposit: number
  termYears: number
  buyerType: string
  customRate?: number | null
  loanAmount: number
  ltv: number
  ltvBracket: string
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  rateUsed: number
  rateType: string
  usedDefaultRates: boolean
  usedCustomRate: boolean
}

/**
 * Buyer type options with metadata
 */
export const BUYER_TYPE_OPTIONS: BuyerTypeOption[] = [
  {
    value: 'FIRST_TIME_BUYER',
    key: 'First Time Buyer',
    info: 'Buying your first property with potential stamp duty relief',
    minDeposit: 5,
  },
  {
    value: 'HOME_MOVER',
    key: 'Home Mover',
    info: 'Moving from one property to another',
    minDeposit: 5,
  },
  {
    value: 'BUY_TO_LET',
    key: 'Buy to Let',
    info: 'Purchasing a property to rent out. Deposit requirements typically range from 20–25%, varying by lender.',
    minDeposit: 20,
  },
  {
    value: 'REMORTGAGE',
    key: 'Remortgage',
    info: 'Refinancing your existing mortgage',
    minDeposit: 10,
  },
]

/**
 * Rate type options with metadata
 */
export const RATE_TYPE_OPTIONS: RateTypeOption[] = [
  {
    value: 'FIXED_2_YEAR',
    key: '2 Year Fixed',
    info: 'Interest rate fixed for 2 years',
  },
  {
    value: 'FIXED_5_YEAR',
    key: '5 Year Fixed',
    info: 'Interest rate fixed for 5 years',
  },
  {
    value: 'VARIABLE',
    key: 'Variable',
    info: 'Interest rate can change at any time',
  },
]

/**
 * Mortgage term options
 */
export const TERM_OPTIONS: TermOption[] = [
  { value: 15, key: '15 years' },
  { value: 20, key: '20 years' },
  { value: 25, key: '25 years' },
  { value: 30, key: '30 years' },
  { value: 35, key: '35 years' },
]

/**
 * Format rate type for display
 */
export function formatRateType(rateType: string): string {
  const map: Record<string, string> = {
    FIXED_2_YEAR: '2 Year Fixed',
    FIXED_3_YEAR: '3 Year Fixed',
    FIXED_5_YEAR: '5 Year Fixed',
    FIXED_10_YEAR: '10 Year Fixed',
    VARIABLE: 'Variable',
    TRACKER: 'Tracker',
    CUSTOM: 'Custom Rate',
  }
  return map[rateType] || rateType
}

/**
 * Format buyer type for display
 */
export function formatBuyerType(buyerType: string): string {
  const map: Record<string, string> = {
    FIRST_TIME_BUYER: 'First Time Buyer',
    HOME_MOVER: 'Home Mover',
    BUY_TO_LET: 'Buy to Let',
    REMORTGAGE: 'Remortgage',
  }
  return map[buyerType] || buyerType
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}
