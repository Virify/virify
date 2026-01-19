export function buildPriceQuery(price: [number, number]) {
  const [min, max] = price

  if (min === max) return `£${min}`

  return `between £${min} and £${max}`
}