<template>
  <div class="| flow">
    <MoleculesAiSearchLoading v-if="pending" />

    <template v-else>
      <OrganismsFilterSwitcher>
        <template v-slot:traditional>
          <OrganismsTraditionalSearchForm @submit-search="searchSubmitTraditional" />
        </template>

        <template v-slot:ai>
          <MoleculesAiSearchFormFilters hide-suggestions :initial-query @submit-search="searhSubmitAi"
            @reset-search="searchReset" />
        </template>
      </OrganismsFilterSwitcher>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 *  @TODO - maybe move this to a better location, or improve the import
 *          aliasing to be less brittle
 */
import type { FormState } from '../../TraditionalSearch/OrganismsTraditionalSearchForm.vue'

const initialQuery = ref('')

/**
 *  Emits
 */
const emits = defineEmits(['search-started'])

/**
 *  Fetch filters
 */
const { pending, fetchResults } = useFetchResults()
const { setFormData } = useGlobalSearchState()

function searhSubmitAi(query: string) {
  setFormData(query, 'ai')
  emits('search-started')

  fetchResults()
}

function searchSubmitTraditional(formData: Partial<FormState>) {
  setFormData(formData, 'traditional')
  emits('search-started')

  fetchResults()
}

function searchReset() {
  setFormData('')
}

</script>
