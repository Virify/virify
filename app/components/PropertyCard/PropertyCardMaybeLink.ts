import type { SetupContext } from 'vue'

interface Props {
  href?: string | null
  as?: string | null
}

/**
 *  @IMPORTANT
 *  This component is non-reactive as props change. This is because the
 *  render function is only ever called once, so the render function
 *  returned will always be the same on. If we want this to be reactive
 *  in the future, we should move the 'if' statements inside the render
 *  function
 */
export default {
  props: {
    href: { type: String },
    as: { type: String },
  },
  setup({ href, as }: Props, { slots, attrs }: SetupContext) {
    const defaultSlot = slots.default?.()

    if (isString(href)) {
      return () => [h('a', { href, ...attrs }, defaultSlot)]
    }

    if (isString(as)) {
      return () => [h(as, attrs, defaultSlot)]
    }

    return () => [defaultSlot]
  }
}