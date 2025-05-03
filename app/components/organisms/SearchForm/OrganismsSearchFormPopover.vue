<template>
  <div class="o-searchform-suggestions | flow flow-2xl">
    <div v-if="suggestions" class="o-searchform-suggestions-autocomplete" role="presentation">
      <div role="presentation">
        <h2 class="| title-sm">Locations</h2>

        <MoleculesAutocomplete :input="suggestions" :matches="suggestionsMatches"
          @suggestion-selected="emitSuggestions" />
      </div>

      <div class="o-searchform-suggestions-map | title-2xl">
        Map
      </div>
    </div>

    <div role="presentation" class="| flow flow-md">
      <h2 class="| title-sm">Property type</h2>

      <MoleculesScrollBox class="| focus-overflow">
        <ul class="o-searchform-suggestions-property-types">
          <li v-for="label of propertType">
            <AtomsToggleBox :label type="checkbox" name="property-type" v-model="selected[label]" />
          </li>
        </ul>
      </MoleculesScrollBox>
    </div>

    <OrganismsSearchFormFooter class="| flow flow-md" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  suggestions: string
}

const props = defineProps<Props>()

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

/**
 *  Mock auto-suggestions
 */
const emits = defineEmits(['suggestion-selected'])

function emitSuggestions(suggestions: string) {
  emits('suggestion-selected', suggestions)
}

const suggestionsMatches = computed(() => {
  const { suggestions } = props

  // Avoid case sensitivity
  const suggestionsLower = suggestions.toLowerCase()

  // Mock filter
  return [
    'Stevenage, Hertfordshire',
    'Steventon, Oxford',
    'St. Albans, Hertforshire',
    'St. Neots, Hertfordshire',
    'Stoke-on-Trent, Staffordshire',
    'Stepps, Glasgow',
    'Stepney, London',
    'Stockwell, London',
    'Stratford, London',
    'South London',
    'South West London'
  ].filter(str => {
    const strLower = str.toLowerCase()

    return strLower.startsWith(suggestionsLower)
  }).slice(0, 5)
})

</script>

<style>
.o-searchform-suggestions {
  text-align: left;
}

.o-searchform-suggestions-autocomplete {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--size-32);
}

.o-searchform-suggestions-property-types {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  gap: var(--size-8);
  white-space: nowrap;
}

.o-searchform-suggestions-map {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--monochrome-800);
  color: var(--monochrome-600);
  border-radius: var(--border-radius-ui);
  aspect-ratio: 1;
}
</style>