<template>
  <div role="presentation" class="m-select-dropdown">
    <select class="m-select-dropdown__input | dynamic-input" :placeholder="placeholder" v-model="editableValue">
      <option v-for="option of options">{{ option }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder: string
  options: string[]
}

defineProps<Props>()

const editableValue = defineModel({ default: '' })

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-select-dropdown {
  display: inline-block;
  position: relative;
}
</style>