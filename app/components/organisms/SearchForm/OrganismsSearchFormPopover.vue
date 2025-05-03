<template>
  <div class="o-searchform-suggestions | flow flow-2xl">
    <slot />

    <div role="presentation" class="| flow flow-md">
      <h3 class="| title-sm">Explore more</h3>

      <ul class="o-searchform-popover-explore-more">
        <li v-for="{ icon, to, content } of exploreMoreLinks">
          <MoleculesIconLink :to :icon :content icon-large class="o-searchform-popover-icon-link" />
        </li>
      </ul>

      <nuxt-link to="#" class="o-searchform-popover-full-button | button button-ghost font-semibold">Advanced
        search</nuxt-link>
    </div>
  </div>
</template>

<script setup>
const exploreMoreLinks = [
  { icon: 'explore/hot', to: '#', content: 'Hot right now' },
  { icon: 'explore/trending', to: '#', content: 'Trending locations' },
  { icon: 'explore/top-picks', to: '#', content: 'Top picks' },
]

</script>

<style>
.o-searchform-popover-explore-more {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);
  align-items: stretch;
}

.o-searchform-popover-icon-link {
  min-height: 10ch;
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
