/**
 * Creates a two-way binding computed property for a component prop.
 * Used to simplify v-model implementations by handling the emit event automatically.
 * 
 * @param props The props object
 * @param key The key of the prop to bind to
 * @param emit The emit function
 * @returns A computed property that emits an update event when set
 */
export const usePropModel = <T extends Record<string, any>, K extends keyof T>(
  props: T,
  key: K,
  emit: (event: any, ...args: any[]) => void
) => {
  return computed({
    get: () => props[key],
    set: (value) => emit(`update:${String(key)}`, value),
  })
}
