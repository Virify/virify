<template>
  <fieldset class="m-formpassword | flow flow-xs" role="presentation">
    <legend class="| visually-hidden">Password with toggle</legend>

    <AtomsLabel :for="passwordId">{{ label }}</AtomsLabel>

    <AtomsInput :id="passwordId" v-bind="$attrs" :type="inputType" class="m-formpassword-input"
      wrapper-class="| relative" :validation-text-overrides="validationTextOverrides">

      <template v-slot:suffix>
        <button type="button" class="m-formpassword-toggle" :aria-label="inputLabel" :aria-controls="passwordId"
          :aria-pressed="show" @click.prevent="toggleShowPassword">
          <AtomsIcon role="none" class="m-formpassword-icon" :icon="inputIcon" />
        </button>
      </template>
    </AtomsInput>
  </fieldset>
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
  validationTextOverrides: {
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