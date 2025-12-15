-- CreateEnum
CREATE TYPE "MortgageRateType" AS ENUM ('FIXED_2_YEAR', 'FIXED_3_YEAR', 'FIXED_5_YEAR', 'FIXED_10_YEAR', 'VARIABLE', 'TRACKER');

-- CreateEnum
CREATE TYPE "MortgageBuyerType" AS ENUM ('FIRST_TIME_BUYER', 'HOME_MOVER', 'BUY_TO_LET', 'REMORTGAGE');

-- CreateEnum
CREATE TYPE "MortgageLtvBracket" AS ENUM ('LTV_60', 'LTV_75', 'LTV_85', 'LTV_90', 'LTV_95');

-- CreateTable
CREATE TABLE "MortgageRate" (
    "id" SERIAL NOT NULL,
    "rateType" "MortgageRateType" NOT NULL,
    "buyerType" "MortgageBuyerType" NOT NULL,
    "ltvBracket" "MortgageLtvBracket" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'GPT-4o-mini UK Average',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortgageRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MortgageRate_rateType_buyerType_ltvBracket_idx" ON "MortgageRate"("rateType", "buyerType", "ltvBracket");

-- CreateIndex
CREATE INDEX "MortgageRate_fetchedAt_idx" ON "MortgageRate"("fetchedAt");

-- CreateIndex
CREATE INDEX "MortgageRate_validUntil_idx" ON "MortgageRate"("validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "MortgageRate_rateType_buyerType_ltvBracket_validUntil_key" ON "MortgageRate"("rateType", "buyerType", "ltvBracket", "validUntil");
