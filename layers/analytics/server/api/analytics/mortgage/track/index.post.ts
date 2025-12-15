import { z } from "zod";

const trackMortgageCalculationSchema = z.object({
  sessionId: z.string().optional(),
  listingId: z.string().optional().nullable(),

  // Input data
  propertyPrice: z.number().positive(),
  deposit: z.number().nonnegative(),
  termYears: z.number().min(5).max(40),
  buyerType: z.enum(["FIRST_TIME_BUYER", "HOME_MOVER", "BUY_TO_LET", "REMORTGAGE"]),
  customRate: z.number().nullable().optional(),

  // Calculated data
  loanAmount: z.number().positive(),
  ltv: z.number().min(0).max(100),
  ltvBracket: z.enum(["LTV_60", "LTV_75", "LTV_85", "LTV_90", "LTV_95"]),

  // Result data
  monthlyPayment: z.number().positive(),
  totalPayment: z.number().positive(),
  totalInterest: z.number().nonnegative(),
  rateUsed: z.number().positive(),
  rateType: z.string(),

  // Meta
  usedDefaultRates: z.boolean(),
  usedCustomRate: z.boolean(),
});

export type TrackMortgageCalculationBody = z.infer<typeof trackMortgageCalculationSchema>;

/**
 * POST /api/analytics/mortgage/track
 * Track a mortgage calculation for analytics
 * Uses sendBeacon for lightweight fire-and-forget tracking
 */
export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    const body = await readValidatedBody(event, trackMortgageCalculationSchema.parse);

    // Record the calculation
    await prisma.mortgageCalculation.create({
      data: {
        userId: user?.id ?? null,
        listingId: body.listingId ?? null,
        sessionId: body.sessionId ?? null,
        propertyPrice: body.propertyPrice,
        deposit: body.deposit,
        termYears: body.termYears,
        buyerType: body.buyerType as any,
        customRate: body.customRate ?? null,
        loanAmount: body.loanAmount,
        ltv: body.ltv,
        ltvBracket: body.ltvBracket as any,
        monthlyPayment: body.monthlyPayment,
        totalPayment: body.totalPayment,
        totalInterest: body.totalInterest,
        rateUsed: body.rateUsed,
        rateType: body.rateType,
        usedDefaultRates: body.usedDefaultRates,
        usedCustomRate: body.usedCustomRate,
      },
    });

    // SendBeacon doesn't process responses, but return success anyway
    return { success: true };
  } catch (error) {
    // Log but don't block - analytics should never break the user experience
    console.error("Error tracking mortgage calculation:", error);
    return { success: false };
  }
});
