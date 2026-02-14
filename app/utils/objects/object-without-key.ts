export function objectWithoutKey<T extends object>(obj: T, key: keyof T): Partial<T> {
  if (!isObject(obj)) return {}
  if (!obj[key]) return obj

  const clonedObject = structuredClone(obj)

  delete clonedObject[key]

  return clonedObject
}