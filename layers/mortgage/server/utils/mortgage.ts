/**
 * Mortgage Calculator Server-Side Utilities
 */

/**
 * Get LTV bracket based on LTV percentage
 */
export function getLtvBracket(ltvPercentage: number): string {
  if (ltvPercentage <= 60) return 'LTV_60'
  if (ltvPercentage <= 75) return 'LTV_75'
  if (ltvPercentage <= 80) return 'LTV_80'
  if (ltvPercentage <= 85) return 'LTV_85'
  if (ltvPercentage <= 90) return 'LTV_90'
  return 'LTV_95'
}

/**
 * Get minimum deposit percentage for buyer type
 */
export function getMinDepositPercentage(buyerType: string): number {
  switch (buyerType) {
    case 'FIRST_TIME_BUYER':
      return 5
    case 'HOME_MOVER':
      return 5
    case 'BUY_TO_LET':
      return 25
    case 'REMORTGAGE':
      return 10
    default:
      return 5
  }
}

/**
 * Get default mortgage rates based on buyer type and LTV bracket
 * These are UK average rates as of late 2024
 */
export function getDefaultRates(buyerType: string, ltvBracket: string): Array<{ rateType: string; rate: number }> {
  const baseRates: Record<string, number> = {
    FIXED_2_YEAR: 5.25,
    FIXED_3_YEAR: 4.99,
    FIXED_5_YEAR: 4.69,
    FIXED_10_YEAR: 4.89,
    VARIABLE: 5.75,
    TRACKER: 5.49,
  }

  // Adjust rates based on LTV
  const ltvAdjustment: Record<string, number> = {
    LTV_60: -0.30,
    LTV_75: -0.15,
    LTV_80: 0,
    LTV_85: 0.15,
    LTV_90: 0.35,
    LTV_95: 0.65,
  }

  // Adjust rates based on buyer type
  const buyerTypeAdjustment: Record<string, number> = {
    FIRST_TIME_BUYER: 0,
    HOME_MOVER: 0,
    BUY_TO_LET: 0.75,
    REMORTGAGE: -0.10,
  }

  const adjustment = (ltvAdjustment[ltvBracket] || 0) + (buyerTypeAdjustment[buyerType] || 0)

  return Object.entries(baseRates).map(([rateType, rate]) => ({
    rateType,
    rate: Math.round((rate + adjustment) * 100) / 100,
  }))
}

/**
 * Calculate monthly mortgage payment
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const numberOfPayments = termYears * 12

  if (monthlyRate > 0) {
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  }
  
  return loanAmount / numberOfPayments
}

/**
 * Calculate mortgage result for a given rate
 */
export function calculateMortgageResult(
  loanAmount: number,
  termYears: number,
  rate: { rateType: string; rate: number }
): {
  rateType: string
  rate: number
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  loanAmount: number
} {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, rate.rate, termYears)
  const totalPayment = monthlyPayment * termYears * 12
  const totalInterest = totalPayment - loanAmount

  return {
    rateType: rate.rateType,
    rate: rate.rate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    loanAmount,
  }
}
