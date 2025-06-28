<template>
  <div ref="$wrapper" role="presentation" class="m-select-dropdown" tabindex="-1" @focusout="checkHidePopover">
    <input class="m-select-dropdown__input | dynamic-input" :placeholder="placeholder" v-model="editableValue"
      @input="showPopover" @focus="selectAll" />

    <ul ref="$popover" class="m-select-dropdown__popover | body-md font-normal flow flow-sm" hidden>
      <li v-for="option of mockDataset">
        <button type="button" @click.prevent="selectOption(option)" class="m-select-dropdown__option">
          {{ option }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder: string
}

defineProps<Props>()

/**
 *  v-model directive
 */
const editableValue = defineModel({ default: '' })

/**
 *  Popover
 */
const $wrapper = useTemplateRef('$wrapper')
const $popover = useTemplateRef('$popover')

function showPopover() {
  if (!$popover.value) return

  const popover = $popover.value

  popover.hidden = false
}

function hidePopover() {
  if (!$popover.value) return

  const popover = $popover.value

  popover.hidden = true
}

async function checkHidePopover({ relatedTarget }: FocusEvent) {
  if (!$wrapper.value) return

  const wrapper = $wrapper.value
  const selection = relatedTarget as Node

  const focusCapture = !!selection && wrapper?.contains(selection)

  if (!focusCapture) hidePopover()
}

/**
 *  Mock prompts
 */
const mockDataset = [
  'Cardiff, South Wales',
  'Cardiff Castle',
  'Cardiff City Center'
]

/**
 *  Select text on focus
 */
function selectAll({ target }: FocusEvent) {
  target && (target as HTMLInputElement).select()
}

function selectOption(option: string) {
  editableValue.value = option

  hidePopover()
}

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-select-dropdown {
  display: inline-block;
  position: relative;

  &__popover {
    overflow: visible;
    position: absolute;
    top: calc(anchor(bottom) + var(--size-10));
    left: anchor(left);
    background: var(--background-200);
    border: 1px solid var(--border-color-200);
    width: max-content;
    min-width: 10ch;
    padding: var(--size-14) var(--size-16);
    box-sizing: border-box;
    border-radius: var(--border-radius-lg);
    z-index: 10;
    list-style: none;
    margin: 0;

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      background: var(--background-200);
      border-top: 1px solid var(--border-color-200);
      border-left: 1px solid var(--border-color-200);
      border-top-left-radius: var(--border-radius-xs);
      position: absolute;
      top: -7px;
      left: 2.5ch;
      transform: rotate(45deg);
    }
  }

  &__option {
    background: none;
    color: currentColor;
    padding: 0;
    margin: 0;
    border: 0;
    font: inherit;

    &:hover {
      color: var(--secondary-400);
    }
  }
}
</style>