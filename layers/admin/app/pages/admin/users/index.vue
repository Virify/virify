<template>
  <UDashboardPanel id="admin-users-panel">
    <template #header>
      <UDashboardNavbar title="User Intelligence" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <!-- Retention -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Retention
          <UIcon name="i-lucide-activity" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Users" :description="fmt(data.totalUsers)" icon="i-lucide-users" :ui="cardUi" />
          <UPageCard title="Active Today" :description="fmt(data.retention.today)" icon="i-lucide-zap" :ui="cardUi" />
          <UPageCard title="Active (7 days)" :description="fmt(data.retention.sevenDays)" icon="i-lucide-calendar" :ui="cardUi" />
          <UPageCard title="Active (30 days)" :description="fmt(data.retention.thirtyDays)" icon="i-lucide-calendar-days" :ui="cardUi" />
          <UPageCard title="Active (90 days)" :description="fmt(data.retention.ninetyDays)" icon="i-lucide-calendar-check" :ui="cardUi" />
          <UPageCard title="Never Logged In" :description="fmt(data.retention.neverLoggedIn)" icon="i-lucide-user-x" :ui="cardUi" />
          <UPageCard title="Membership Upgrades" :description="fmt(data.upgrades)" icon="i-lucide-arrow-up-circle" :ui="cardUi" />
        </div>

        <!-- Growth -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Monthly Sign-ups (last 12 months)
          <UIcon name="i-lucide-trending-up" class="text-secondary" />
        </h2>
        <UTable :data="data.growth" :columns="growthColumns" />

        <!-- Activation & Verification -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Activation Funnel
              <UIcon name="i-lucide-filter" class="text-secondary" />
            </h2>
            <UTable :data="data.activationFunnel" :columns="activationColumns" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Review Status
              <UIcon name="i-lucide-shield-check" class="text-secondary" />
            </h2>
            <UTable :data="data.reviewStatus" :columns="reviewColumns" />
          </div>
        </div>

        <!-- Verification Completeness -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Verification Completeness
          <UIcon name="i-lucide-badge-check" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard
            v-for="(val, key) in data.verificationCompleteness"
            :key="key"
            :title="String(key)"
            :description="`${fmt(val.count)} (${val.pct}%)`"
            icon="i-lucide-check-circle"
            :ui="cardUi"
          />
        </div>

        <!-- Profile Completeness -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Profile Completeness
          <UIcon name="i-lucide-user" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <UPageCard
            v-for="(val, key) in data.profileCompleteness"
            :key="key"
            :title="String(key)"
            :description="`${fmt(val.count)} (${val.pct}%)`"
            icon="i-lucide-circle-user"
            :ui="cardUi"
          />
        </div>

        <!-- Intent & Membership -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Buyer Intent Breakdown
              <UIcon name="i-lucide-target" class="text-secondary" />
            </h2>
            <UTable :data="data.intentBreakdown" :columns="intentColumns" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Membership Distribution
              <UIcon name="i-lucide-layers" class="text-secondary" />
            </h2>
            <UTable :data="data.membershipDistribution" :columns="membershipColumns" />
          </div>
        </div>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const { data, status } = await useAsyncData("admin-users", () =>
  useRequestFetch()("/api/admin/users"),
);

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};

const growthColumns = [
  { accessorKey: "month", header: "Month" },
  { accessorKey: "count", header: "New Users" },
];

const activationColumns = [
  { accessorKey: "status", header: "Activated" },
  { accessorKey: "count", header: "Count" },
];

const reviewColumns = [
  { accessorKey: "status", header: "Reviewed" },
  { accessorKey: "count", header: "Count" },
];

const intentColumns = [
  { accessorKey: "intent", header: "Intent" },
  { accessorKey: "count", header: "Users" },
];

const membershipColumns = [
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "count", header: "Count" },
];
</script>
