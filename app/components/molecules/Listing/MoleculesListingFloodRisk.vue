<template>
  <section class="o-listing-flood-risk">
    <div v-if="error" class="o-listing-flood-risk__error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="o-listing-flood-risk__content">
      <div class="o-listing-flood-risk__card-grid">
        <AtomsHeroCard>
          <div class="o-listing-flood-risk__data-header">
            <AtomsIcon icon="listings/flood" :size="42" />
            <h3 class="title-md">Flood Risk</h3>
          </div>
          <p class="| r-body-md-sm">We've checked the latest flood data so you don't have to. This gives you a heads up
            on
            any potential flooding risks in the area, helping you make informed decisions about your next home.</p>
          <div class="o-listing-flood-risk__risk-highlight">
            <h3 class="o-listing-flood-risk__risk-level | title-sm" v-if="!loading">
              {{ getRiskLevelText(floodRiskLevel) }}
            </h3>
            <div v-else class="skeleton-bar skeleton-bar--title"></div>

            <p class="o-listing-flood-risk__risk-description | r-body-md-sm" v-if="!loading">
              {{ getRiskDescription(floodRiskLevel) }}
            </p>
            <div v-else class="skeleton-bar skeleton-bar--body"></div>
          </div>
        </AtomsHeroCard>

        <AtomsHeroCard>
          <div class="o-listing-flood-risk__data-header">
            <AtomsIcon icon="listings/flood" :size="42" />
            <h3 class="title-md">Summary</h3>
          </div>
          <p class="| r-body-md-sm">This is a summary of the flood risk data in the last 10 years.</p>
          <div class="o-listing-flood-risk__data-points">
            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | r-body-md-sm font-semibold">Flood Events:</span>
              <span class="o-listing-flood-risk__data-value | r-body-md-sm font-semibold" v-if="!loading">{{
                historicalFloodEvents?.length || 0
              }}</span>
              <div v-else class="skeleton-bar skeleton-bar--small"></div>
            </div>

            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | r-body-md-sm font-semibold">Search Radius:</span>
              <span class="o-listing-flood-risk__data-value | r-body-md-sm font-semibold">10 miles</span>
            </div>
            <div class="o-listing-flood-risk__data-point">
              <span class="o-listing-flood-risk__data-label | r-body-md-sm font-semibold">Monitoring Stations:</span>
              <span class="o-listing-flood-risk__data-value | r-body-md-sm font-semibold" v-if="!loading">{{
                floodStations?.length || 0
              }}</span>
              <div v-else class="skeleton-bar skeleton-bar--small"></div>
            </div>
          </div>
        </AtomsHeroCard>
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

  &__card-grid {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: var(--size-20);
    width: 100%;
    flex-direction: row;

    >AtomsHeroCard {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-16);

      >AtomsHeroCard {
        width: 100%;
        align-items: stretch;
      }
    }
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
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-12);
    width: 100%;
    height: 100%;
    margin: var(--size-32) auto;
  }

  &__data-point {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: fn.faded-color(12%, var(--monochrome-600));
    border: 2px solid var(--secondary-400);
    border-radius: var(--border-radius-xl);
    padding: var(--size-16);
    color: var(--monochrome-900);
    width: 100%;
    gap: var(--size-8);

    @include mq.mobile-only {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: left;
      gap: var(--size-8);

      .o-listing-flood-risk__data-value {
        font-weight: bold;
      }
    }
  }

  &__disclaimer {
    text-align: center;

    p {
      text-align: left;
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