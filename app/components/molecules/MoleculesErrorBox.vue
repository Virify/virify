<template>
  <section class="m-error-box | flow flow-xs">
    <h2 class="m-error-box-title | title-xs">
      <AtomsIcon title="Error icon" icon="errors/error" class="m-error-box-icon" />

      {{ errorTitle }}
    </h2>

    <div class="m-error-box-content" role="presentation">
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
  color: var(--error-foreground);
  background-color: var(--error-background);
  padding: var(--size-16);
  border-radius: var(--border-radius-lg);
}

.m-error-box-title {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  margin: 0;
}

.m-error-box-icon {
  flex: 0 0 auto;
  width: var(--size-24);
  height: var(--size-24);
}

.m-error-box-content {
  padding-left: calc(var(--size-24) + var(--size-12));
}
</style>