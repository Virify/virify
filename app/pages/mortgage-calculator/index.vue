<template>
  <div class="mortgage-page">
    <!-- Hero section -->
    <OrganismsBannerHero
      class="container"
      compact
      description="Estimate your monthly mortgage payments. Enter your property price, deposit and see what you could be paying with current UK rates."
    >
      <template #title>
        Mortgage Calculator
      </template>
    </OrganismsBannerHero>

    <!-- Calculator -->
    <div class="mortgage-page__calculator | container">
      <OrganismsMortgageCalculator />
    </div>

    <!-- Understanding Your Mortgage Section -->
    <UPageSection
      title="Understanding Your Mortgage"
      description="Getting a mortgage is one of the biggest financial decisions you'll make. Here's what you need to know."
      headline="Key Concepts"
      class="p-index__hero-dark"
      :ui="{ headline: 'text-secondary' }"
    >
      <template #features>
        <UPageCard
          icon="i-lucide-percent"
          title="Loan-to-Value (LTV)"
          description="The ratio of your mortgage loan to the property's value. Lower LTV ratios (bigger deposits) typically unlock better interest rates and more lender options."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-trending-up"
          title="Interest Rates"
          description="Determines how much you pay on top of what you borrowed. Even small differences can mean thousands of pounds over your mortgage term."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-calendar"
          title="Mortgage Term"
          description="How long you have to repay your mortgage. Longer terms mean lower monthly payments but more total interest paid over time."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
      </template>
    </UPageSection>

    <!-- Mortgage Types Section -->
    <UPageSection
      title="Types of Mortgage Rates"
      description="Choose the right mortgage type for your situation and financial goals."
      headline="Mortgage Types"
      :ui="{ headline: 'text-secondary' }"
    >
      <template #features>
        <UPageCard
          icon="i-lucide-lock"
          title="Fixed Rate"
          description="Your interest rate stays the same for an agreed period (typically 2-5 years). This gives you certainty over your monthly payments, protecting you if interest rates rise."
          :ui="{
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-activity"
          title="Tracker Rate"
          description="Your rate moves in line with the Bank of England base rate, plus a set percentage. When the base rate goes down, so do your payments — but they'll rise if rates increase."
          :ui="{
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-sliders-horizontal"
          title="Variable Rate"
          description="Your lender's standard variable rate (SVR) can change at any time. Often higher than other options, but typically has no early repayment charges."
          :ui="{
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
      </template>
    </UPageSection>

    <!-- First-Time Buyer Tips Section -->
    <UPageSection
      title="Tips for First-Time Buyers"
      description="Making your first property purchase? These essential tips will help you navigate the mortgage process."
      headline="Buying Tips"
      class="p-index__hero-dark"
      :ui="{ headline: 'text-secondary' }"
    >
      <template #features>
        <UPageCard
          icon="i-lucide-credit-card"
          title="Check Your Credit Score"
          description="Lenders use this to decide your rates. Check for errors and pay down debts before applying for a mortgage."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-piggy-bank"
          title="Budget Beyond the Deposit"
          description="Save for stamp duty, legal fees, surveys, and moving costs — typically an extra 3-5% of the property price."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          icon="i-lucide-file-check-2"
          title="Get an Agreement in Principle"
          description="Shows sellers you're serious and gives you clarity on what you can afford before house hunting."
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-bottom-right"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'title-md',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-sm',
            body: 'flex flex-col justify-evenly',
          }"
        />
      </template>
    </UPageSection>

    <!-- CTA Section -->
    <UPageCTA
      title="Ready to market the new way?"
      description="Thousands are ready for intelligent property searching and better, equal marketing opportunities. Are you?"
      :ui="{ root: 'rounded-none ring-0' }"
    >
      <template #links>
        <UButton
          color="neutral"
          icon="i-lucide-user-plus"
          size="lg"
          variant="solid"
          class="font-bold button button-secondary"
          @click="showSignup"
        >Sign Up</UButton>
      </template>
    </UPageCTA>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogSignup } from '#components'

const { showDialog } = useDialog()

function showSignup() {
  showDialog({ component: ViewsDialogSignup })
}

useSeoMeta({
  title: 'Mortgage Calculator — Virify',
  description: 'Estimate your monthly mortgage payments in seconds. Enter your property price and deposit to compare typical UK mortgage rates and understand LTV, interest rates, and mortgage terms.',
  keywords: 'mortgage calculator, UK mortgage calculator, monthly mortgage payments, interest rate, loan to value, LTV, deposit, first time buyer',
  ogTitle: 'Mortgage Calculator — Virify',
  ogDescription: 'Estimate monthly mortgage payments and compare typical UK rates. Understand deposit, LTV and mortgage terms.',
  ogType: 'website',
  ogUrl: 'https://virify.co.uk/mortgage-calculator',
  ogImage: 'https://virify.co.uk/img/ai-search-cover.png',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://virify.co.uk/img/ai-search-cover.png',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://virify.co.uk/mortgage-calculator' }],
})

useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://virify.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Mortgage Calculator', item: 'https://virify.co.uk/mortgage-calculator' },
    ],
  },
])
</script>

<style lang="scss">
.mortgage-page__calculator {
  padding: var(--size-64) 0;
}
</style>
