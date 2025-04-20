<template>
  <section class="m-error-box | box box-lg box-error">
    <AtomsIcon title="Error icon" icon="errors/error" class="m-error-box-icon" />

    <div class="| flow flow-xs">
      <h2 class="m-error-box-title | title-xs">
        {{ errorTitle }}
      </h2>

      <p v-if="errorsIsString" class="| body-sm">{{ errorContent }}</p>

      <ul v-else-if="errorsIsArray && errorContent.length">
        <li v-for="{ type, message } of errorContent" class="body-sm">
          {{ type }} - {{ message }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  errorTitle: {
    type: String,
    default: 'An unspecified error occurred'
  },
  errorContent: {
    type: [String, Array]
  }
})

/**
 *  Determine format to render errors
 */
const errorsIsString = computed(() => {
  const { errorContent } = props

  return isString(errorContent)
})

const errorsIsArray = computed(() => {
  const { errorContent } = props

  return Array.isArray(errorContent) && errorContent.every((error) => {
    if (!isObject(error)) return false

    return error.type && error.message
  })
})
</script>

<style>
.m-error-box {
  display: flex;
  gap: var(--size-12);
}

.m-error-box-title {
  margin: 0;
}

.m-error-box-icon {
  height: var(--lineheight-sm);
  width: var(--lineheight-sm);
  flex-shrink: 0;
}
</style>