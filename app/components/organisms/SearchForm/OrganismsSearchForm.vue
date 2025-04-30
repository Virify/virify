<template>
  <form class="o-searchform | flow flow-sm">
    <MoleculesSwitcher class="o-searchform-buyrent" legend="Buy or rent" :options="[
      { key: 'buy', value: 'Buy' },
      { key: 'rent', value: 'Rent' },
    ]" v-model="buyOrRent" />

    <div ref="$form" class="o-searchform-form" tabindex="-1">
      <OrganismsSearchFormCore @search-input="setSuggestions" class="o-searchform-box" v-model="currentSearch" />

      <div ref="$popover" class="o-searchform-popover | container container-md elevate-300" hidden>
        <OrganismsSearchFormSuggestions :suggestions @suggestion-selected="setSelectedSuggestion" />
      </div>
    </div>

    <AtomsDivider text="or" class="o-searchform-divider" />

    <div role="presentation" class="o-searchform-footer-links">
      <MoleculesIconLink to="#" icon="explore/ai" content="Search using AI" icon-inline />
      <MoleculesIconLink to="#" icon="explore/map" content="Search by map" icon-inline />
    </div>
  </form>
</template>

<script setup>
import { useFocusWithin } from '@vueuse/core'

/**
 *  Popover management
 */
const $form = useTemplateRef('$form')
const $popover = useTemplateRef('$popover')

// Toggle popover as necessary with focus enabled
const { focused } = useFocusWithin($form)

watch(focused, (containsFocus) => {
  $popover.value.toggleAttribute('hidden', !containsFocus)
})

/**
 *  Search typed
 */
const suggestions = ref('')
const currentSearch = ref('')

function setSuggestions(search) {
  suggestions.value = search
}

function setSelectedSuggestion(suggestion) {
  currentSearch.value = suggestion
}

/**
 *  Buy or rent
 */
const buyOrRent = ref('buy')
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.o-searchform {
  max-width: 32em;
  margin: 0 auto;
}

.o-searchform-buyrent {
  background: fn.faded-color(12%, var(--primary-700));
  backdrop-filter: blur(10px);
  color: var(--monochrome-900);
}

.o-searchform-form {
  position: relative;
}

.o-searchform-box,
.o-searchform-popover {
  background: var(--monochrome-900);
  color: var(--monochrome-100);
  border-radius: var(--border-radius-xl);
}

.o-searchform-box {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  padding: var(--size-12);
}

.o-searchform-popover {
  position: absolute;
  top: calc(100% + var(--size-12));
  left: 50%;
  transform: translateX(-50%);
  width: min(100vw - var(--size-72), 42em);
  padding: var(--size-32);
}

.o-searchform-divider {
  --divider-100: 1px solid currentColor;

  margin-left: auto;
  margin-right: auto;
  max-width: calc(100% - var(--size-32));
  color: var(--monochrome-400);
}

.o-searchform-footer-links {
  display: flex;
  align-items: stretch;
  gap: var(--size-16);
}

.o-searchform-footer-links a {
  flex-grow: 1;
}

/**
 *  Open animatinos
 */
@starting-style {
  .o-searchform-popover {
    opacity: 0;
    transform: translateX(-50%) translateY(-1em)
  }
}

.o-searchform-popover {
  display: block;
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
}
</style>