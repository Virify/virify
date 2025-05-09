/**
 *  Check if argument is a string or number
 *
 */
export function isStringy(arg: unknown): arg is string | number {
  const isStringOrNumber = ['string', 'number'].includes(typeof arg)

  return arg === 0 || (!!arg && isStringOrNumber)
}
