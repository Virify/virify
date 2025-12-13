import { z } from 'zod'
import { prisma } from '~~/layers/database/server/utils/prisma-client'
import type { MortgageCalculationResponse, MortgageResult } from '~~/shared/types/mortgage'
import {
  getLtvBracket,
  getMinDepositPercentage,
  formatBuyerType,
  getDefaultRates,
  calculateMortgageResult,
} from '~~/layers/mortgage/server/utils/mortgage'

const calculationSchema = z.object({
  propertyPrice: z.number().positive('Property price must be positive'),
  deposit: z.number().nonnegative('Deposit cannot be negative'),
  termYears: z.number().int().min(5).max(40).default(25),
  buyerType: z.enum(['FIRST_TIME_BUYER', 'HOME_MOVER', 'BUY_TO_LET', 'REMORTGAGE']),
  rateType: z.enum(['FIXED_2_YEAR', 'FIXED_3_YEAR', 'FIXED_5_YEAR', 'FIXED_10_YEAR', 'VARIABLE', 'TRACKER']).optional(),
})

/**
 * POST /api/mortgage/calculate
 * Calculates mortgage payments based on input parameters
 */
export default defineEventHandler(async (event): Promise<MortgageCalculationResponse> => {
  const body = await readBody(event)
  
  // Validate input
  const validation = calculationSchema.safeParse(body)
  
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.issues[0]?.message || 'Invalid input',
    })
  }

  const { propertyPrice, deposit, termYears, buyerType, rateType } = validation.data

  // Calculate LTV
  const loanAmount = propertyPrice - deposit
  const ltvPercentage = (loanAmount / propertyPrice) * 100

  // Determine LTV bracket
  const ltvBracket = getLtvBracket(ltvPercentage)

  // Validate deposit requirements
  const minDepositPercentage = getMinDepositPercentage(buyerType)
  const actualDepositPercentage = (deposit / propertyPrice) * 100

  if (actualDepositPercentage < minDepositPercentage) {
    throw createError({
      statusCode: 400,
      statusMessage: `Minimum deposit for ${formatBuyerType(buyerType)} is ${minDepositPercentage}%`,
    })
  }

  try {
    // Fetch applicable rates from database
    const whereClause: any = {
      validUntil: null,
      buyerType,
      ltvBracket,
    }

    if (rateType) {
      whereClause.rateType = rateType
    }

    let rates = await prisma.mortgageRate.findMany({
      where: whereClause,
    })

    // If no specific rates found, try with common rate types
    if (rates.length === 0 && !rateType) {
      rates = await prisma.mortgageRate.findMany({
        where: {
          validUntil: null,
          buyerType,
        },
      })
    }

    // If still no rates, use default rates
    const useDefaultRates = rates.length === 0
    const applicableRates = useDefaultRates ? getDefaultRates(buyerType, ltvBracket) : rates

    // Calculate results for each rate type
    const results: MortgageResult[] = applicableRates.map((rate: { rateType: string; rate: number }) => {
      return calculateMortgageResult(loanAmount, termYears, rate)
    })

    // Get the latest rate fetch date if using database rates
    const ratesLastUpdated = !useDefaultRates && rates.length > 0
      ? rates[0]?.fetchedAt?.toISOString() ?? null
      : null

    return {
      success: true,
      data: {
        propertyPrice,
        deposit,
        depositPercentage: actualDepositPercentage,
        loanAmount,
        ltv: Math.round(ltvPercentage * 100) / 100,
        ltvBracket,
        termYears,
        buyerType,
        results,
        usingDefaultRates: useDefaultRates,
        ratesLastUpdated,
      },
    }
  } catch (error: any) {
    console.error('Mortgage calculation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to calculate mortgage',
    })
  }
})
