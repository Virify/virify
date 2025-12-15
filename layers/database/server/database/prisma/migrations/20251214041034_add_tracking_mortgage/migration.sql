-- CreateTable
CREATE TABLE "MortgageCalculation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "listingId" TEXT,
    "sessionId" TEXT,
    "propertyPrice" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "termYears" DOUBLE PRECISION NOT NULL,
    "buyerType" "MortgageBuyerType" NOT NULL,
    "customRate" DOUBLE PRECISION,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "ltv" DOUBLE PRECISION NOT NULL,
    "ltvBracket" "MortgageLtvBracket" NOT NULL,
    "monthlyPayment" DOUBLE PRECISION NOT NULL,
    "totalPayment" DOUBLE PRECISION NOT NULL,
    "totalInterest" DOUBLE PRECISION NOT NULL,
    "rateUsed" DOUBLE PRECISION NOT NULL,
    "rateType" TEXT NOT NULL,
    "usedDefaultRates" BOOLEAN NOT NULL DEFAULT false,
    "usedCustomRate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MortgageCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MortgageCalculation_userId_idx" ON "MortgageCalculation"("userId");

-- CreateIndex
CREATE INDEX "MortgageCalculation_listingId_idx" ON "MortgageCalculation"("listingId");

-- CreateIndex
CREATE INDEX "MortgageCalculation_buyerType_idx" ON "MortgageCalculation"("buyerType");

-- CreateIndex
CREATE INDEX "MortgageCalculation_createdAt_idx" ON "MortgageCalculation"("createdAt");

-- AddForeignKey
ALTER TABLE "MortgageCalculation" ADD CONSTRAINT "MortgageCalculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
