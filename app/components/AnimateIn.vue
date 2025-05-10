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
    const [defaultSlot] = slots.default?.({})

    try {
      if (!isString(animationName) || !isNumber(delay)) {
        throw new TypeError('Invalid props')
      }

      // Ensure props exists
      if (!defaultSlot.props) {
        defaultSlot.props = {}
      }

      // Get props from default slot
      const { props = {} } = defaultSlot

      // Create new classnames, styles
      const newClasses = joinAttr(props.class, `| ${animationName}`)
      const newStyles = defu(props.style, { '--delay': `${delay}ms` })

      // Add classname, style
      defaultSlot.props.class = newClasses
      defaultSlot.props.style = newStyles
    }
    catch (err) {
      console.error(err)
    }

    // Return slot
    return () => defaultSlot
  }
}
</script>