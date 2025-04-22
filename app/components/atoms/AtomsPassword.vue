<template>
  <fieldset>
    <legend class="| visually-hidden">Password with toggle</legend>

    <AtomsLabel :label :for="passwordId" />

    <div class="a-password" role="none">
      <input :id="passwordId" v-bind="$attrs" :type="inputType" class="a-password-input | text-input"
        :aria-describedby="errorId" @input="checkValidity" />

      <client-only>
        <!-- Client only as this feature only works with JS anyway -->
        <button type="button" class="a-password-toggle" :aria-label="inputLabel" :aria-controls="passwordId"
          :aria-pressed="show" @click.prevent="toggleShowPassword">
          <AtomsIcon role="none" class="a-password-icon" :icon="inputIcon" />
        </button>
      </client-only>
    </div>

    <span v-if="errorText" :id="errorId" class="| text-input-error body-sm">
      {{ errorText }}
    </span>
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
 *  Validate inputs - this can probably be made into a composable
 */
const errorText = ref(null)

function checkValidity({ target }) {
  const { validationTextOverrides: overrides } = props

  errorText.value = useInputValidationMessage(target, overrides)
}

/**
 *  a11y
 */
const errorId = useId()
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
.a-password {
  position: relative;
}

.a-password-input {
  padding-right: var(--input-text-height);
}

.a-password-toggle {
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

.a-password-icon {
  width: var(--size-20);
  height: var(--size-20);
}

@media (hover: hover) {
  .a-password:not(:hover):not(:focus-within) .a-password-toggle {
    opacity: 0;
  }
}
</style>