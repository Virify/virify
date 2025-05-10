export function joinAttr(...attrs: string[]): string {
  return attrs.filter(isString).join(' ')
}