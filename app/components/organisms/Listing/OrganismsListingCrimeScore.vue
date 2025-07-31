<template>
  <section class="o-listing-crime-score">
    <h3 class="o-listing-crime-score__title | title-md">Crime & Safety</h3>
    <p class="| body-md">Safety matters when choosing where to live. We've crunched the local crime numbers to give you
      a clear picture of what's happening in the neighbourhood, so you can feel confident about your move.</p>

    <div v-if="loading" class="o-listing-crime-score__loading">
      <AtomsBarSpinner />
      <p>Loading crime data...</p>
    </div>

    <div v-else-if="error" class="o-listing-crime-score__error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="o-listing-crime-score__content">
      <div class="crime-data-grid">
        <!-- Crime Overview Column -->
        <div class="overview-column">
          <h3 class="column-title | title-xs">Crime Overview ({{ dataYear }})</h3>

          <div class="crime-analytics">
            <!-- Overall Crime Score Card -->
            <div class="stat-card-with-info" v-if="overallScoreCard">
              <MoleculesStatCard :title="overallScoreCard.title" :value="overallScoreCard.value"
                :description="overallScoreCard.description" :info="crimeInfoText.overallScore" :icon="overallScoreCard.icon" />
            </div>

            <!-- Total Incidents Card -->
            <div class="stat-card-with-info" v-if="totalIncidentsCard">
              <MoleculesStatCard :title="totalIncidentsCard.title" :value="totalIncidentsCard.value"
                :description="totalIncidentsCard.description" :info="crimeInfoText.totalIncidents" :icon="totalIncidentsCard.icon" />
            </div>

            <!-- Most Common Crime Card -->
            <div class="stat-card-with-info" v-if="mostCommonCrimeCard">
              <MoleculesStatCard :title="mostCommonCrimeCard.title" :value="mostCommonCrimeCard.value"
                :description="mostCommonCrimeCard.description" :info="crimeInfoText.mostCommon" :icon="mostCommonCrimeCard.icon" />
            </div>

            <!-- Safety Level Card -->
            <div class="stat-card-with-info" v-if="safetyLevelCard">
              <MoleculesStatCard :title="safetyLevelCard.title" :value="safetyLevelCard.value"
                :description="safetyLevelCard.description" :info="crimeInfoText.safetyLevel" :icon="safetyLevelCard.icon" />
            </div>
          </div>
          <div class="o-listing-crime-score__disclaimer">
            <p class="body-xs">
              Crime data provided by data.police.uk. Data covers a 5-mile radius and may be up to 2 months behind current
              date.
            </p>
          </div>
        </div>

        <!-- Crime Breakdown Column -->
        <div class="breakdown-column" v-if="crimesByCategory?.length > 0">
          <h3 class="column-title | title-xs">Crime Breakdown</h3>
          <div class="crime-breakdown-list">
            <MoleculesCrimeBreakdownCard v-for="category in crimesByCategory.slice(0, 6)" :key="category.category"
              :category="category.category" :count="category.count"
              :percentage="(category.count / maxCategoryCount) * 100" />
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  lat: number
  lon: number
}

const props = defineProps<Props>()

const {
  loading,
  error,
  crimeScore,
  crimesByCategory,
  dataYear,
  fetchAreaCrimeData,
  maxCategoryCount,
  overallScoreCard,
  totalIncidentsCard,
  mostCommonCrimeCard,
  safetyLevelCard,
  crimeInfoText
} = useCrimeData()

onMounted(() => {
  fetchAreaCrimeData(props.lat, props.lon, 8047) // 5 miles = 8047 meters
})


</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-listing-crime-score {
  border-radius: var(--border-radius-2xl);

  &__title {
    margin-bottom: var(--size-16);
  }

  &__content {
    display: grid;
    gap: var(--size-20);
  }

  .crime-data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-16);
    margin-top: var(--size-32);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--size-24);
    }
  }

  .column-title {
    margin: 0 0 var(--size-16) 0;
    color: var(--foreground-100);
  }

  .overview-column {
    .crime-analytics {
      display: flex;
      flex-direction: column;
      gap: var(--size-16);
    }
  }

  &__loading,
  &__error {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-24);
    text-align: center;
    justify-content: center;
    flex-direction: column;
  }

  &__error {
    color: var(--color-danger-600);
  }

  // All pills use the same blue color like PricePaid
  .stat-card-with-info .pill,
  .crime-breakdown-list .pill {
    background: var(--blue-400) !important;
  }

  .crime-breakdown-list {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
  }

  &__disclaimer {
    padding-top: var(--size-12);
  }
}
</style>