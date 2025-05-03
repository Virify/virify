<template>
  <div role="presentation">
    <h3 class="| title-sm">Explore more</h3>

    <ul class="o-searchform-footer-explore-more">
      <li v-for="{ icon, to, content } of exploreMoreLinks">
        <MoleculesIconLink :to :icon :content icon-large class="o-searchform-footer-icon-link" />
      </li>
    </ul>

    <nuxt-link to="#" class="o-searchform-footer-full-button | button button-ghost font-semibold">Advanced
      search</nuxt-link>
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
.o-searchform-footer-explore-more {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);
  align-items: stretch;
}

.o-searchform-footer-full-button {
  display: block;
  text-decoration: none;
  padding: var(--size-12);
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--border-radius-ui);
}
</style>