<template>
  <div class="| flow flow-2xl">
    <slot />

    <OrganismsSearchFormTitleBlock title="Explore more" class="| animate-fade-up" style="--delay: 250ms">
      <ul class="o-searchform-popover-explore-more">
        <li v-for="{ icon, to, content }, index of exploreMoreLinks" class="| animate-fade-up"
          :style="`--delay: ${250 + index * 20}ms`">
          <MoleculesIconLink :to :icon :content icon-large class="o-searchform-popover-icon-link" />
        </li>
      </ul>

      <nuxt-link to="#" class="o-searchform-popover-full-button | button button-ghost font-semibold animate-fade-up"
        style="--delay: 350ms">Advanced
        search</nuxt-link>
    </OrganismsSearchFormTitleBlock>
  </div>
</template>

<script setup>
const exploreMoreLinks = [
  { icon: 'explore/hot', to: '#', content: 'Hot right now' },
  { icon: 'explore/trending', to: '#', content: 'Trending locations' },
  { icon: 'explore/top-picks', to: '#', content: 'Top picks' },
]

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-searchform-popover-explore-more {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-16);
  align-items: stretch;

  @include mq.tablet {
    grid-template-columns: repeat(3, 1fr);
  }
}

.o-searchform-popover-icon-link {
  @include mq.tablet {
    min-height: 10ch;
  }
}

.o-searchform-popover-full-button {
  display: block;
  text-decoration: none;
  padding: var(--size-12);
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--border-radius-ui);
}
</style>
