<template>
  <UDashboardPanel id="admin-mortgage-panel">
    <template #header>
      <UDashboardNavbar title="Mortgage Intelligence" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <!-- Totals -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Usage Overview
          <UIcon name="i-lucide-calculator" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="All Time" :description="fmt(data.totals.allTime)" icon="i-lucide-database" :ui="cardUi" />
          <UPageCard title="This Month" :description="fmt(data.totals.thisMonth)" icon="i-lucide-calendar-days" :ui="cardUi" />
          <UPageCard title="Linked to Listing" :description="fmt(data.totals.linkedToListing)" icon="i-lucide-link" :ui="cardUi" />
          <UPageCard title="Standalone" :description="fmt(data.totals.standalone)" icon="i-lucide-calculator" :ui="cardUi" />
        </div>

        <!-- Rate Preference -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Rate Preference
          <UIcon name="i-lucide-sliders-horizontal" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <UPageCard title="Used Default Rates" :description="fmt(data.ratePreference.usedDefaultRates)" icon="i-lucide-server" :ui="cardUi" />
          <UPageCard title="Used Custom Rate" :description="fmt(data.ratePreference.usedCustomRate)" icon="i-lucide-pencil" :ui="cardUi" />
        </div>

        <!-- Averages -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Average Values
          <UIcon name="i-lucide-bar-chart-2" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <UPageCard
            title="Avg Property Price"
            :description="data.averages.propertyPrice != null ? `£${fmt(Math.round(data.averages.propertyPrice))}` : 'N/A'"
            icon="i-lucide-home"
            :ui="cardUi"
          />
          <UPageCard
            title="Avg Deposit"
            :description="data.averages.deposit != null ? `£${fmt(Math.round(data.averages.deposit))}` : 'N/A'"
            icon="i-lucide-piggy-bank"
            :ui="cardUi"
          />
          <UPageCard
            title="Avg LTV"
            :description="data.averages.ltv != null ? `${data.averages.ltv}%` : 'N/A'"
            icon="i-lucide-percent"
            :ui="cardUi"
          />
          <UPageCard
            title="Avg Loan Amount"
            :description="data.averages.loanAmount != null ? `£${fmt(Math.round(data.averages.loanAmount))}` : 'N/A'"
            icon="i-lucide-banknote"
            :ui="cardUi"
          />
          <UPageCard
            title="Avg Monthly Payment"
            :description="data.averages.monthlyPayment != null ? `£${fmt(Math.round(data.averages.monthlyPayment))}` : 'N/A'"
            icon="i-lucide-calendar"
            :ui="cardUi"
          />
          <UPageCard
            title="Avg Term"
            :description="data.averages.termYears != null ? `${data.averages.termYears} yrs` : 'N/A'"
            icon="i-lucide-clock"
            :ui="cardUi"
          />
        </div>

        <!-- Breakdowns & Monthly Trend -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Buyer Type Breakdown
              <UIcon name="i-lucide-users" class="text-secondary" />
            </h2>
            <UTable :data="data.buyerTypeBreakdown" :columns="[{ accessorKey: 'type', header: 'Buyer Type' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              LTV Bracket Breakdown
              <UIcon name="i-lucide-layers" class="text-secondary" />
            </h2>
            <UTable :data="data.ltvBracketBreakdown" :columns="[{ accessorKey: 'bracket', header: 'LTV Bracket' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
        </div>

        <!-- Property Price Distribution -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Property Price Distribution
          <UIcon name="i-lucide-pound-sterling" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <UPageCard
            v-for="bracket in data.propertyPriceDistribution"
            :key="bracket.bracket"
            :title="bracket.bracket"
            :description="fmt(bracket.count)"
            icon="i-lucide-banknote"
            :ui="cardUi"
          />
        </div>

        <!-- Monthly Trend -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Monthly Trend (Last 12 Months)
          <UIcon name="i-lucide-trending-up" class="text-secondary" />
        </h2>
        <UTable :data="data.monthlyTrend" :columns="[{ accessorKey: 'month', header: 'Month' }, { accessorKey: 'count', header: 'Calculations' }]" />
      </template>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const { data, status } = await useAsyncData("admin-mortgage", () =>
  useRequestFetch()("/api/admin/mortgage"),
);

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};
</script>
