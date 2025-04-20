<template>
  <section class="m-error-box | box box-lg box-error flow">
    <h2 class="m-error-box-title | title-xs">{{ errorTitle }}</h2>

    <p v-if="errorsIsString" class="| body-sm">{{ errorContent }}</p>

    <ul v-else-if="errorsIsArray && errorContent.length">
      <li v-for="{ type, message } of errorContent" class="body-sm">
        {{ type }} - {{ message }}
      </li>
    </ul>
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
.m-error-box-title {
  margin: 0;
}
</style>