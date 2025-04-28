<template>
  <section class="m-error-box | flow flow-xs">
    <h2 v-if="formattedError.title" class="m-error-box-title | title-xs">
      <AtomsIcon title="Error icon" icon="errors/error" class="m-error-box-icon" />

      {{ formattedError.title }}
    </h2>

    <div class="m-error-box-content" role="presentation">
      <p v-if="formattedError.message" class="| body-sm">
        {{ formattedError.message }}
      </p>

      <ul v-if="formattedError.list?.length">
        <li v-for="{ type, message } of formattedError.list" class="body-sm">
          {{ type }} - {{ message }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ErrorBoxProp } from '~/types'

const props = withDefaults(defineProps<{ error: ErrorBoxProp }>(), {
  error: 'An error occurred'
})

/**
 *  Determine format to render errors
 */
const formattedError = computed(() => {
  const { error } = props

  // If error is a string, return that
  if (isString(error)) {
    return {
      title: error
    }
  }

  // If error is instance of Error, return error message
  if (isError(error)) {
    return {
      title: error.message || 'An error occurred'
    }
  }

  // Otherwise try and destructure error message
  const { title, message, list } = asObject(error)

  // Return in valid format
  return {
    title: asString(title),
    message: asString(message),
    list: asArray(list).filter(isObject),
  }
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