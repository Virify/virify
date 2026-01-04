<template>
  <section class="o-hero" v-if="!showSearch">
    <div class="container">
      <div class="o-hero__content">
        <h1 class="o-hero__title | title-2xl">
          <AtomsGradientTextRenderer :text="title" variant="dark" />
        </h1>
        <p class="o-hero__subtitle | body-lg">{{ subtitle }}</p>

        <div class="o-hero__search-demo" v-if="input">
          <MoleculesAnimatedSearchInput />
        </div>
      </div>
    </div>
  </section>

  <section class="o-hero__search" v-if="showSearch">
    <div class="o-hero__search-content | flow flow-xl">
      <h1 class="o-hero__search-title | title-2xl lineheight-xs">
        Find Your Perfect Home with
        <span class="gradient-text"> Virify AI </span>
      </h1>

      <!-- When searching from for-sale page, this would be sale etc -->
      <OrganismsDockBanner listingType="all" />
    </div>
  </section>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  subtitle: string;
  search?: boolean;
  input?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  search: false,
  input: false,
});

const { isWaitingListMode } = useWaitingListMode();
const showSearch = props.search && !isWaitingListMode.value;
</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

// Helpers
@mixin hero-gradient() {
  background: linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
}

@mixin hero-background() {
  background:
    url("/img/logo-background.svg") no-repeat top right,
    linear-gradient(135deg, var(--blue-400) 50%, var(--secondary-400) 150%);
  background-size:
    auto 120%,
    cover;
}

// Hero component styles
.o-hero {
  @include hero-gradient();
  
  @include mq.small-tablet {
    @include hero-background();
  }

  padding: var(--size-64) var(--size-32);
  min-height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--size-8);
  }

  &__title {
    margin-bottom: var(--size-24);
    color: var(--monochrome-900);
  }

  &__subtitle {
    margin: 0 auto var(--size-32);
    color: var(--monochrome-900);
  }

  &__search-demo {
    max-width: 600px;
    margin: 0 auto;
  }

  &__search {
    @include hero-gradient();
    @include hero-background();
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: var(--size-64) var(--size-32);
    box-sizing: border-box;
    text-align: center;

    &-content {
      max-width: min(100%, 45rem);
      margin: 0 auto;
      flex: 1 0;
    }
  }

  &__search-title {
    color: var(--monochrome-900);
    max-width: 20ch;
    margin: 0 auto var(--size-40);
  }
}
</style>
