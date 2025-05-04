<template>
  <MoleculesFormField :label v-slot="{ id }">
    <AtomsInput v-bind="$attrs" :id :type="inputType" class="m-formpassword-input" wrapper-class="| relative"
      :custom-validation="customValidation">
      <template v-slot:suffix>
        <button type="button" class="m-formpassword-toggle" :aria-label="inputLabel" :aria-controls="id"
          :aria-pressed="show" @click.prevent="toggleShowPassword">
          <AtomsIcon role="none" class="m-formpassword-icon" :icon="inputIcon" />
        </button>
      </template>
    </AtomsInput>
  </MoleculesFormField>
</template>

<script setup>
/**
 *  Prevent attributes being added to fieldset
 */
defineOptions({
  inheritAttrs: false
})

/**
 *  Apply the appropriate settings for password inputs
 */
const props = defineProps({
  customValidation: {
    type: Object
  },
  label: {
    type: String
  }
})

/**
 *  a11y
 */
const passwordId = useId()

/**
 *  Toggle between types
 */
const show = ref(false)

const inputType = computed(() => show.value ? 'text' : 'password')
const inputIcon = computed(() => show.value ? 'not-visible' : 'visible')
const inputLabel = computed(() => show.value ? 'Hide password' : 'Show password')

function toggleShowPassword() {
  show.value = !show.value
}
</script>

<style>
.m-formpassword {
  position: relative;
}

.m-formpassword-input {
  padding-right: var(--input-text-height);
}

.m-formpassword-toggle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  transition: opacity var(--animation-fast);
}

.m-formpassword-icon {
  width: var(--size-20);
  height: var(--size-20);
}

@media (hover: hover) {
  .m-formpassword:not(:hover):not(:focus-within) .m-formpassword-toggle {
    opacity: 0;
  }
}
</style>