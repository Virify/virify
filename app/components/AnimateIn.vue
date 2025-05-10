<script>
import defu from 'defu'

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

    // Get default slot
    const defaultSlot = computed(() => slots.default?.({})[0])

    try {
      if (!isString(animationName) || !isNumber(delay)) {
        throw new TypeError('Invalid props')
      }

      // Ensure props exists
      if (!defaultSlot.value.props) {
        defaultSlot.value.props = {}
      }

      // Get props from default slot
      const { props = {} } = defaultSlot.value

      // Create new classnames, styles
      const newClasses = joinAttr(props.class, `| ${animationName}`)
      const newStyles = defu(props.style, { '--delay': `${delay}ms` })

      // Add classname, style
      defaultSlot.value.props.class = newClasses
      defaultSlot.value.props.style = newStyles
    }
    catch (err) {
      console.error(err)
    }

    // Return slot
    return () => [defaultSlot.value]
  }
}
</script>