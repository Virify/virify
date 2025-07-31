<template>
  <section class="o-listing-flood-risk">
    <div v-if="error" class="o-listing-flood-risk__error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="o-listing-flood-risk__content">
      <AtomsHeroCard>
        <div class="o-listing-flood-risk__data-summary">
          <div class="o-listing-flood-risk__data-header">
            <AtomsIcon icon="listings/flood" :size="42" />
            <h3 class="title-md">Flood Risk</h3>
          </div>
          <p class="| body-md">We've checked the latest flood data so you don't have to. This gives you a heads up on
            any potential flooding risks in the area, helping you make informed decisions about your next home.</p>
          <div class="o-listing-flood-risk__risk-highlight">
            <h3 class="o-listing-flood-risk__risk-level | title-md" v-if="!loading">
              {{ getRiskLevelText(floodRiskLevel) }}
            </h3>
            <div v-else class="skeleton-bar skeleton-bar--title"></div>
            
            <p class="o-listing-flood-risk__risk-description | body-md" v-if="!loading">
              {{ getRiskDescription(floodRiskLevel) }}
            </p>
            <div v-else class="skeleton-bar skeleton-bar--body"></div>
          </div>
          <h3 class="| title-xs">Historical Data (Last 10 Years):</h3>
          <div class="o-listing-flood-risk__data-points">
            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | body-md font-semibold">Flood Events:</span>
              <span class="o-listing-flood-risk__data-value | body-md font-semibold" v-if="!loading">{{ historicalFloodEvents?.length || 0
                }}</span>
              <div v-else class="skeleton-bar skeleton-bar--small"></div>
            </div>
            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | body-md font-semibold">Monitoring Stations:</span>
              <span class="o-listing-flood-risk__data-value | body-md font-semibold" v-if="!loading">{{ floodStations?.length || 0
                }}</span>
              <div v-else class="skeleton-bar skeleton-bar--small"></div>
            </div>
            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | body-md font-semibold">Search Radius:</span>
              <span class="o-listing-flood-risk__data-value | body-md font-semibold">10 miles</span>
            </div>
          </div>
        </div>

        <div class="o-listing-flood-risk__disclaimer">
          <p class="body-xs">
            Data provided by Environment Agency. This information is for guidance only and should not be relied upon for
            safety critical applications.
          </p>
        </div>
      </AtomsHeroCard>
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
  floodRiskLevel,
  historicalFloodEvents,
  floodStations,
  floodEventsSummary,
  fetchFloodData,
  getRiskLevelText,
  getRiskDescription
} = useFloodRisk()

onMounted(() => {
  fetchFloodData(props.lat, props.lon)
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

.o-listing-flood-risk {
  &__content {
    display: grid;
    gap: var(--size-20);
    width: 100%;
  }

  &__data-summary {
    width: 100%;
  }

  &__data-header {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--size-12);
    margin-bottom: var(--size-16);

    h3 {
      margin: 0;
    }
  }

  &__loading,
  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: var(--size-12);
    padding: var(--size-24);
    text-align: center;
    color: var(--secondary-400);
  }

  &__error {
    color: var(--error);
  }

  &__risk-highlight {
    background-color: fn.faded-color(12%, var(--monochrome-600));
    border: 2px solid var(--secondary-400);
    border-radius: var(--border-radius-xl);
    padding: var(--size-16);
    margin: var(--size-32) auto;
    text-align: center;
    color: var(--monochrome-900);
    max-width: fit-content;
  }

  &__risk-level {
    margin: 0 0 var(--size-8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__risk-description {
    margin: 0;
  }

  &__data-points {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--size-12);
    margin: var(--size-16) 0;
  }

  &__data-point {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: 2px solid var(--background-200);
    padding: var(--size-16);
    background: var(--secondary-400);
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-100);
  }

  &__disclaimer {
    text-align: center;

    p {
      margin: 0;
      color: var(--monochrome-900);
    }
  }

  // Skeleton loading styles
  .skeleton-bar {
    background: linear-gradient(90deg, var(--monochrome-100) 25%, var(--blue-300) 50%, var(--blue-400) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;

    &--title {
      height: 24px;
      width: 60%;
      margin-bottom: 8px;
    }

    &--body {
      height: 16px;
      width: 80%;
    }

    &--small {
      height: 16px;
      width: 40px;
    }
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}
</style>