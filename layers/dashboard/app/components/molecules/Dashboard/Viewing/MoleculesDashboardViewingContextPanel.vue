<template>
  <div class="rounded-md bg-(--background-200) p-3 flex flex-col gap-1">
    <p class="body-xs font-semibold text-(--foreground-200)">{{ title }}</p>
    <!-- Date badge (used for counter-propose context) -->
    <UBadge v-if="dateText" icon="i-lucide-check" color="success" variant="subtle" size="md" class="mt-0.5 w-fit">
      {{ dateText }}
    </UBadge>
    <!-- Optional descriptive paragraph -->
    <p v-if="description" class="body-xs text-(--foreground-200)">{{ description }}</p>
    <!-- Date badges (used for accept-mode requester availability) -->
    <div v-if="dateBadges?.length" class="flex flex-wrap gap-1 mt-1">
      <UBadge v-for="d in dateBadges" :key="d" color="secondary" variant="subtle" size="md">
        {{ d }}
      </UBadge>
    </div>
    <!-- Time preference badges -->
    <template v-if="timeBadges?.length">
      <p class="body-xs text-(--foreground-200) w-full mt-1">Preferred times</p>
      <div class="flex flex-wrap gap-1">
        <UBadge v-for="t in timeBadges" :key="t" color="neutral" variant="subtle" size="md">
          {{ t }}
        </UBadge>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  /** Single date/time displayed as plain text (e.g. owner's counter-proposed time) */
  dateText?: string;
  /** Optional small description shown below dateText */
  description?: string;
  /** Array of formatted date strings shown as secondary colour badges */
  dateBadges?: string[];
  /** Array of preferred time strings shown as neutral colour badges */
  timeBadges?: string[];
}>();
</script>
