#!/usr/bin/env tsx
/**
 * Standalone script to fetch UK mortgage rates
 * Usage: pnpm fetch-rates
 */

import { config } from 'dotenv'
config()

import OpenAI from "openai"
import { prisma } from '../../../database/server/utils/prisma-client'

async function fetchRates() {
  console.log("[Mortgage] Starting rate fetch...")

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // Get the previous month's name and year
  const now = new Date()
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const monthName = previousMonth.toLocaleString('en-GB', { month: 'long' })
  const year = previousMonth.getFullYear()

  const prompt = `You are a UK mortgage rate data provider. Provide the average UK mortgage rates from ${monthName} ${year} for different buyer types and LTV brackets.

Return ONLY a valid JSON array with the following structure (no markdown, no explanation):
[
  {
    "rateType": "FIXED_2_YEAR" | "FIXED_3_YEAR" | "FIXED_5_YEAR" | "FIXED_10_YEAR" | "VARIABLE" | "TRACKER",
    "buyerType": "FIRST_TIME_BUYER" | "HOME_MOVER" | "BUY_TO_LET" | "REMORTGAGE",
    "ltvBracket": "LTV_60" | "LTV_75" | "LTV_85" | "LTV_90" | "LTV_95",
    "rate": number (e.g., 4.5 for 4.5%)
  }
]

Provide rates for the most common combinations:
- All 4 buyer types
- LTV brackets: 60%, 75%, 85%, 90%, 95%
- Rate types: FIXED_2_YEAR, FIXED_5_YEAR, VARIABLE (at minimum)

Base rates on UK market averages from ${monthName} ${year} as reported by major lenders and mortgage comparison sites.

Important rate relationships:
- Variable/Tracker rates are typically 0.3-0.8% HIGHER than fixed rates (they carry more risk for the borrower)
- First Time Buyers often get slightly better rates
- Buy to Let rates are typically 0.5-1% higher than residential rates
- Higher LTV brackets have higher rates (95% LTV is highest, 60% LTV is lowest)`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data assistant that provides accurate UK mortgage rate information. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      console.error("[Mortgage] No content in GPT response")
      process.exit(1)
    }

    // Parse the JSON response
    let rates: Array<{
      rateType: string
      buyerType: string
      ltvBracket: string
      rate: number
    }>

    try {
      // Clean the response in case it has markdown code blocks
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      rates = JSON.parse(cleanedContent)
    }
    catch (parseError) {
      console.error("[Mortgage] Failed to parse GPT response:", content)
      process.exit(1)
    }

    if (!Array.isArray(rates) || rates.length === 0) {
      console.error("[Mortgage] Invalid rates data structure")
      process.exit(1)
    }

    const timestamp = new Date()

    // Mark all existing rates as expired
    await prisma.mortgageRate.updateMany({
      where: {
        validUntil: null,
      },
      data: {
        validUntil: timestamp,
      },
    })

    // Insert new rates
    const createdRates = await prisma.mortgageRate.createMany({
      data: rates.map((rate) => ({
        rateType: rate.rateType as any,
        buyerType: rate.buyerType as any,
        ltvBracket: rate.ltvBracket as any,
        rate: rate.rate,
        fetchedAt: timestamp,
        validFrom: timestamp,
        validUntil: null,
        source: "GPT-4o-mini UK Average",
      })),
      skipDuplicates: true,
    })

    console.log(`[Mortgage] ✅ Successfully stored ${createdRates.count} mortgage rates`)
  }
  catch (error) {
    console.error("[Mortgage] Error fetching rates:", error)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
  }
}

fetchRates()
