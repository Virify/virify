<script>
import defu from 'defu'
import { cloneVNode, mergeProps } from 'vue'

export default {
  props: {
    animationName: {
      type: String,
      default: 'animate-fade-down'
    },
    delay: {
      type: Number,
      default: 0
    }
  },
  setup({ animationName, delay }) {
    const slots = useSlots()

    // Get default slot, with new props
    const defaultSlot = computed(() => {
      const slot = slots.default?.({})[0]

      slot.props = mergeProps(slot.props, {
        class: `| ${animationName}`,
        style: { '--delay': `${delay}ms` }
      })

      return slot
    })

    // Return slot
    return () => [defaultSlot.value]
  }
}
</script>