<template>
  <div class="o-hero-home | container">
    <div class="o-hero-home-content">
      <h1 class="o-hero-home-title | title-2xl lineheight-xs">
        {{ title }}
      </h1>

      <AtomsDivider text="or" class="o-hero-home-divider" />

      <div role="presentation" class="o-hero-home-footer-links">
        <MoleculesIconLink class="o-hero-home-footer-link" to="#" icon="explore/ai" content="Search using AI"
          icon-inline />
        <MoleculesIconLink class="o-hero-home-footer-link" to="/map-search/" icon="explore/map" content="Search by map"
          icon-inline />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Property search on another level',
  },
});
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.o-hero-home {
  background: linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
  color: var(--monochrome-900);
  border-radius: var(--border-radius-3xl);
  min-height: max(400px, 50vh);
  margin-bottom: var(--size-32);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-56) var(--size-20);

  @include mq.tablet {
    padding: var(--size-72) var(--size-32);
    background:
      url('/img/logo-background.svg') no-repeat top right, linear-gradient(70deg, var(--monochrome-100), var(--primary-200));
    background-size: auto 120%, cover;
  }
}

.o-hero-home-content {
  text-align: center;
}

.o-hero-home-title {
  max-width: 15ch;
  margin: 0 auto var(--size-32);
}

.o-hero-home-divider {
  margin-left: auto;
  margin-right: auto;
  max-width: calc(100% - var(--size-32));
}

.o-hero-home-footer-links {
  display: flex;
  align-items: stretch;
  gap: var(--size-16);
}

.o-hero-home-footer-link {
  flex-grow: 1;
  background-color: fn.faded-color(12%, var(--monochrome-600));

  &:hover {
    background-color: fn.faded-color(24%, var(--monochrome-600));
  }
}
</style>