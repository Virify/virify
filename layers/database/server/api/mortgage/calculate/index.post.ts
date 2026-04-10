import { z } from "zod";

const calculationSchema = z.object({
  propertyPrice: z.number().positive("Property price must be positive"),
  deposit: z.number().nonnegative("Deposit cannot be negative"),
  termYears: z.number().min(5).max(40).default(25),
  buyerType: z.enum(["FIRST_TIME_BUYER", "HOME_MOVER", "BUY_TO_LET", "REMORTGAGE"]),
  rateType: z.enum(["FIXED_2_YEAR", "FIXED_3_YEAR", "FIXED_5_YEAR", "FIXED_10_YEAR", "VARIABLE", "TRACKER"]).optional(),
  customInterestRate: z.number().min(0).max(15).nullable().optional(),
  repaymentType: z.enum(["REPAYMENT", "INTEREST_ONLY"]).optional().default("REPAYMENT"),
});

// Cache duration: 4 weeks in seconds (to match monthly cron)
const FOUR_WEEKS_IN_SECONDS = 60 * 60 * 24 * 28;
const CACHE_KEY = "mortgage:rates";

/**
 * Fetch mortgage rates from database with caching
 */
async function getMortgageRates(buyerType: MortgageBuyerType, ltvBracket: MortgageLtvBracket, rateType?: MortgageRateType) {
  console.log(`[CACHE] Checking mortgage rates cache`);

  // Try to get from cache first
  const startTime = Date.now();
  const cacheStorage = useStorage("cache");
  const cached = await cacheStorage.getItem<any[]>(CACHE_KEY);
  
  let allRates: any[];
  
  if (cached) {
    const cacheTime = Date.now() - startTime;
    console.log(`[CACHE] MORTGAGE RATES CACHE HIT - Retrieved in ${cacheTime}ms`);
    allRates = cached;
  } else {
    console.log(`[CACHE] MORTGAGE RATES CACHE MISS - Fetching from database`);

    // Fetch all current rates
    allRates = await prisma.mortgageRate.findMany({
      where: {
        validUntil: null,
      },
    });

    // Cache for 4 weeks (rates only update monthly)
    await cacheStorage.setItem(CACHE_KEY, allRates, {
      ttl: FOUR_WEEKS_IN_SECONDS,
    });

    const totalTime = Date.now() - startTime;
    console.log(`[CACHE] Cached ${allRates.length} rates - Total time: ${totalTime}ms`);
  }

  // Filter to the specific buyer type, LTV bracket, and optional rate type
  return allRates.filter((rate) => 
    rate.buyerType === buyerType &&
    rate.ltvBracket === ltvBracket &&
    (!rateType || rate.rateType === rateType)
  );
}

/**
 * POST /api/mortgage/calculate
 * Calculates mortgage payments based on input parameters
 */
export default defineEventHandler(async (event): Promise<MortgageCalculationResponse> => {
  const body = await readBody(event);

  // Validate input
  const validation = calculationSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.issues[0]?.message || "Invalid input",
    });
  }

  const { propertyPrice, deposit, termYears, buyerType, rateType, customInterestRate, repaymentType } = validation.data;

  const calcResult = repaymentType === 'INTEREST_ONLY' ? calculateInterestOnlyResult : calculateMortgageResult;

  // Calculate LTV
  const loanAmount = propertyPrice - deposit;
  const ltvPercentage = (loanAmount / propertyPrice) * 100;

  // Determine LTV bracket
  const ltvBracket = getLtvBracket(ltvPercentage);

  // Validate deposit requirements
  const minDepositPercentage = getMinDepositPercentage(buyerType);
  const actualDepositPercentage = (deposit / propertyPrice) * 100;

  if (actualDepositPercentage < minDepositPercentage) {
    throw createError({
      statusCode: 400,
      statusMessage: `Minimum deposit for ${formatBuyerType(buyerType)} is ${minDepositPercentage}%`,
    });
  }

  try {
    // If user provided a custom interest rate, use only that
    if (customInterestRate !== null && customInterestRate !== undefined) {
      const customResult = calcResult(loanAmount, termYears, {
        rateType: "CUSTOM",
        rate: customInterestRate,
      });

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
          repaymentType,
          results: [customResult],
          usingDefaultRates: false,
          usingCustomRate: true,
          ratesLastUpdated: null,
        },
      };
    }

    // Fetch applicable rates from cache (cached for 4 weeks)
    const rates = await getMortgageRates(buyerType, ltvBracket, rateType);

    // If still no rates, use default rates
    const useDefaultRates = rates.length === 0;
    const applicableRates = useDefaultRates ? getDefaultRates(buyerType, ltvBracket) : rates;

    // Calculate results for each rate type
    const results: MortgageResult[] = applicableRates.map((rate: { rateType: string; rate: number }) => {
      return calcResult(loanAmount, termYears, rate);
    });

    // Get the latest rate fetch date if using database rates
    // Note: fetchedAt may be a string (from cache) or Date (from DB)
    const fetchedAt = rates[0]?.fetchedAt;
    const ratesLastUpdated = !useDefaultRates && fetchedAt
      ? (typeof fetchedAt === 'string' ? fetchedAt : fetchedAt.toISOString())
      : null;

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
        repaymentType,
        results,
        usingDefaultRates: useDefaultRates,
        ratesLastUpdated,
      },
    };
  } catch (error: any) {
    console.error("Mortgage calculation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to calculate mortgage",
    });
  }
});
