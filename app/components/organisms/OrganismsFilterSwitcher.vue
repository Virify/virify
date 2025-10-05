<template>
  <div class="o-property-filter">
    <MoleculesSwitcher name="search-type" legend="Change search type" :options="toggleSearchType" v-model="searchType"
      class="o-property-filter__switcher" />

    <template v-if="searchType === 'traditional'">
      <h2 v-if="showTitles" class="| title-md">Traditional search</h2>

      <slot name="traditional"></slot>
    </template>

    <template v-else>
      <h2 v-if="showTitles" class="| title-md">AI powered search</h2>

      <slot name="ai"></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showTitles?: boolean
}

defineProps<Props>()

/**
 *  Toggle between search variant
 */
const searchType = useState('search-type', () => 'ai')

const toggleSearchType = [
  { value: 'Traditional search', key: 'traditional' },
  { value: 'AI search', key: 'ai' }
]

</script>

<style lang="scss">
.o-property-filter {

  &__switcher {
    margin: 0 0 var(--size-32);
  }
}
</style>