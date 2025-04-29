<template>
  <div class="o-searchform-suggestions | flow flow-2xl">
    <div v-if="suggestions" class="o-searchform-suggestions-autocomplete" role="presentation">
      <div role="presentation">
        <h2 class="| title-xs">Locations</h2>

        <ul>
          <li>
            {{ suggestions }}
          </li>
        </ul>
      </div>

      <div role="presentation">
        <h2 class="| title-xs">Map</h2>
      </div>
    </div>

    <div role="presentation" class="| flow flow-md">
      <h2 class="| title-xs">Property type</h2>

      <MoleculesScrollBox>
        <ul class="o-searchform-suggestions-property-types">
          <li v-for="label of propertType">
            <AtomsToggleBox :label type="checkbox" name="property-type" v-model="selected[label]" />
          </li>
        </ul>
      </MoleculesScrollBox>
    </div>

    <div role="presentation" class="| flow flow-md">
      <h3 class="| title-xs">Explore more</h3>

      <ul class="o-searchform-suggestions-explore-more">
        <li>
          <MoleculesIconLink to="#" icon="explore/hot" content="Hot right now" />
        </li>
        <li>
          <MoleculesIconLink to="#" icon="explore/trending" content="Trending locations" />
        </li>
        <li>
          <MoleculesIconLink to="#" icon="explore/top-picks" content="Top picks" />
        </li>
      </ul>

      <nuxt-link to="#" class="o-searchform-suggestions-full-button | button button-ghost font-semibold">Advanced
        search</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  suggestions: string
}

defineProps<Props>()

const propertType = [
  'Detached',
  'Semi-detached',
  'Terraced',
  'End-terrace',
  'Flat',
  'Cottage',
  'Bungalow',
]

const selected = reactive<Record<string, boolean>>({
  'Detached': true,
  'Semi-detached': true,
  'Terraced': true,
  'End-terrace': true
})

</script>

<style>
.o-searchform-suggestions {
  text-align: left;
}

.o-searchform-suggestions-autocomplete {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--size-16);
}

.o-searchform-suggestions-property-types {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  gap: var(--size-8);
  white-space: nowrap;
}

.o-searchform-suggestions-explore-more {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);
}

.o-searchform-suggestions-full-button {
  display: block;
  text-decoration: none;
  padding: var(--size-12);
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--border-radius-ui);
}
</style>