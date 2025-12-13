<template>
  <div class="mortgage-page">
    <!-- Hero section -->
    <section class="mortgage-hero">
      <div class="container">
        <div class="mortgage-hero__content">
          <h1 class="title-2xl lineheight-xs gradient-text">Mortgage Calculator</h1>
          <p class="body-lg">
            Estimate your monthly mortgage payments. Enter your property price, deposit and see what you could be paying with current UK rates.
          </p>
        </div>
      </div>
    </section>

    <!-- Calculator -->
    <div class="mortgage-page__calculator | container">
      <OrganismsMortgageCalculator />

      <!-- Disclaimer -->
      <div class="mortgage-disclaimer">
        <AtomsIcon icon="property/info" :size="18" />
        <p class="body-xs">
          <strong>Important:</strong> This calculator provides estimates only and does not constitute financial advice. 
          Your actual mortgage rate will depend on your credit history, income, property type, and lender criteria. 
          We recommend speaking with a qualified mortgage advisor before making any financial decisions.
        </p>
      </div>
    </div>

    <!-- Understanding Your Mortgage Section -->
    <section class="mortgage-section mortgage-section--gradient">
      <div class="container">
        <header class="mortgage-section__header">
          <h2 class="title-xl">Understanding Your <span class="gradient-text">Mortgage</span></h2>
          <p class="body-md max-width-prose section-subtitle">
            Getting a mortgage is one of the biggest financial decisions you'll make. Here's what you need to know.
          </p>
        </header>

        <div class="mortgage-section__grid">
          <MoleculesFeatureTile 
            icon-name="listings/savings"
            title="Loan-to-Value (LTV)"
            subtitle="Your deposit ratio"
            description="The ratio of your mortgage loan to the property's value. Lower LTV ratios (bigger deposits) typically unlock better interest rates and more lender options."
            variant="default"
          />
          <MoleculesFeatureTile 
            icon-name="property/info"
            title="Interest Rates"
            subtitle="The cost of borrowing"
            description="Determines how much you pay on top of what you borrowed. Even small differences can mean thousands of pounds over your mortgage term."
            variant="default"
          />
          <MoleculesFeatureTile 
            icon-name="listings/map"
            title="Mortgage Term"
            subtitle="Repayment length"
            description="How long you have to repay your mortgage. Longer terms mean lower monthly payments but more total interest paid over time."
            variant="default"
          />
        </div>
      </div>
    </section>

    <!-- Mortgage Types Section -->
    <section class="mortgage-section mortgage-section--white">
      <div class="container">
        <header class="mortgage-section__header">
          <h2 class="title-xl">Types of <span class="gradient-text-light">Mortgage Rates</span></h2>
          <p class="body-md max-width-prose section-subtitle">
            Choose the right mortgage type for your situation and financial goals.
          </p>
        </header>

        <div class="mortgage-section__grid">
          <MoleculesFeatureTile 
            icon-name="listings/savings"
            title="Fixed Rate"
            subtitle="Budget certainty"
            description="Your interest rate stays the same for an agreed period (typically 2-5 years). This gives you certainty over your monthly payments, protecting you if interest rates rise."
            variant="blue"
          />
          <MoleculesFeatureTile 
            icon-name="listings/signal"
            title="Tracker Rate"
            subtitle="Rate drops potential"
            description="Your rate moves in line with the Bank of England base rate, plus a set percentage. When the base rate goes down, so do your payments — but they'll rise if rates increase."
            variant="blue"
          />
          <MoleculesFeatureTile 
            icon-name="listings/map"
            title="Variable Rate"
            subtitle="Maximum flexibility"
            description="Your lender's standard variable rate (SVR) can change at any time. Often higher than other options, but typically has no early repayment charges."
            variant="blue"
          />
        </div>
      </div>
    </section>

    <!-- First-Time Buyer Tips Section -->
    <section class="mortgage-benefits mortgage-benefits--gradient">
      <div class="container">
        <header class="mortgage-benefits__header">
          <h2 class="title-xl">Tips for <span class="gradient-text">First-Time Buyers</span></h2>
          <p class="body-md max-width-prose section-subtitle">
            Making your first property purchase? These essential tips will help you navigate the mortgage process.
          </p>
        </header>

        <div class="mortgage-benefits__cards">
          <AtomsHeroCard>
            <h3 class="title-md">Check Your <span class="gradient-text">Credit Score</span></h3>
            <p class="body-md">Lenders use this to decide your rates. Check for errors and pay down debts before applying for a mortgage.</p>
          </AtomsHeroCard>
          <AtomsHeroCard variant="secondary">
            <h3 class="title-md">Budget <span class="gradient-text">Beyond the Deposit</span></h3>
            <p class="body-md">Save for stamp duty, legal fees, surveys, and moving costs — typically an extra 3-5% of the property price.</p>
          </AtomsHeroCard>
          <AtomsHeroCard>
            <h3 class="title-md">Get an <span class="gradient-text">Agreement in Principle</span></h3>
            <p class="body-md">Shows sellers you're serious and gives you clarity on what you can afford before house hunting.</p>
          </AtomsHeroCard>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <MoleculesCtaSection
      title="Ready to market the {gradient}new way?{/gradient}"
      description="Thousands are ready for intelligent property searching and better, equal marketing opportunities. Are you?"
      button-text="Join the waiting list"
      :gradient="false"
      to="/"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Mortgage Calculator | Virify',
  meta: [
    { name: 'description', content: 'Calculate your estimated monthly mortgage payments. See how much you could pay each month based on property price, deposit, and mortgage type. Learn about LTV, interest rates, and mortgage types.' }
  ]
})
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.mortgage-page {
  background: var(--background-100);
}

.mortgage-hero {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  color: var(--monochrome-900);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 45vh;

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }
}

.mortgage-page__calculator {
  padding: var(--size-64) 0;
}

// Shared section styles (like homepage)
.mortgage-section {
  padding: var(--size-120) 0;

  &--white {
    background: var(--background-100);
  }

  &--gradient {
    background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    color: var(--monochrome-900);
  }

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);

    h2 {
      margin-bottom: var(--size-16);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-32);

    @include mq.tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.notebook {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

// Benefits Section (like early access benefits on homepage)
.mortgage-benefits {
  padding: var(--size-120) 0;

  &--gradient {
    background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
    color: var(--monochrome-900);
  }

  &__header {
    text-align: center;
    margin-bottom: var(--size-48);

    h2 {
      margin-bottom: var(--size-16);
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
    max-width: 1200px;
    margin: 0 auto;

    @include mq.tablet {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.notebook {
      grid-template-columns: repeat(3, 1fr);
    }

    h3 {
      margin: 0 0 var(--size-16) 0;
    }

    p {
      margin: 0;
    }
  }
}

// Disclaimer (now inside calculator container)
.mortgage-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: var(--size-12);
  margin-top: var(--size-32);
  padding: var(--size-16);
  background: var(--background-200);
  border-radius: var(--border-radius-lg);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--blue-400);
  }

  p {
    margin: 0;
    color: var(--text-muted);
  }
}

// Utility classes
.max-width-prose {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}

.section-subtitle {
  margin: var(--size-12) auto 0;
}
</style>
