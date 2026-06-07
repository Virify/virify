<!--
  @TODO
  This component is incomplete and currently inactive
-->

<template>
  <div class="| dialog-container dialog-container-md">
    <OrganismsFilterSwitcher>
      <template v-slot:traditional>
        <OrganismsTraditionalSearchFormSkeleton v-if="isTraditionalFormLoading" />

        <LazyOrganismsTraditionalSearchForm @is-loaded="hideTraditionalFormLoader"
          @submit-search="traditionalSearchSubmit" />
      </template>

      <template v-slot:ai>
        <MoleculesAiSearchFormFilters hideReset @submit-search="aiSearchSubmit" />
      </template>
    </OrganismsFilterSwitcher>
  </div>
</template>

<script setup lang="ts">
const { hideDialog } = useDialog()

/**
 *  Manage lazy hydration
 *  @TODO [OrganismsTraditionalSearchForm] this is duplicated
 */
const isTraditionalFormLoading = ref(true)

function hideTraditionalFormLoader() {
  isTraditionalFormLoading.value = false
}

/**
 *  Traditional search form handler
 */
async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  hideDialog({
    type: 'traditional',
    data: formData
  })
}

/**
 *  AI search form handler
 */
async function aiSearchSubmit(query: string) {
  hideDialog({
    type: 'ai',
    data: query
  })
};
</script>