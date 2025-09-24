
/**
 * Deeply compares two values for equality.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @param seen A map to keep track of circular references.
 * @returns True if the values are equal, false otherwise.
 */
export function objectsEqual(a: any, b: any, seen = new WeakMap()): boolean {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();
  if (isRegExp(a) && isRegExp(b)) return a.source === b.source && a.flags === b.flags;
  if (typeof a !== typeof b) return false;
  if (!isObject(a) || !isObject(b)) return false;

  // circular detection
  if (seen.has(a)) return seen.get(a) === b;
  seen.set(a, b);

  // Arrays
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!objectsEqual(a[i], b[i], seen)) return false;
    return true;
  }

  // Map
  if (a instanceof Map) {
    if (!(b instanceof Map) || a.size !== b.size) return false;
    for (const [k, v] of a) {
      if (!b.has(k) || !objectsEqual(v, b.get(k), seen)) return false;
    }
    return true;
  }

  // Set
  if (a instanceof Set) {
    if (!(b instanceof Set) || a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }

  // Typed arrays
  if (isTypedArray(a)) {
    if (!isTypedArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  // plain object
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) return false;
    const key = keysA[i] as string;
    if (!objectsEqual((a as any)[key], (b as any)[key], seen)) return false;
  }
  return true;
}

/**
 * Checks if a value is an object.
 * @param o The object to check.
 * @returns True if the value is an object, false otherwise.
 */
function isObject(o: any) {
  return o !== null && typeof o === "object";
}

/**
 * Checks if a value is a date.
 * @param o The object to check.
 * @returns True if the value is a date, false otherwise.
 */
function isDate(o: any) {
  return Object.prototype.toString.call(o) === "[object Date]";
}

/**
 * Checks if a value is a regular expression.
 * @param o The object to check.
 * @returns True if the value is a regular expression, false otherwise.
 */
function isRegExp(o: any) {
  return Object.prototype.toString.call(o) === "[object RegExp]";
}

/**
 * Checks if a value is a typed array.
 * @param o The object to check.
 * @returns True if the value is a typed array, false otherwise.
 */
function isTypedArray(o: any) {
  return ArrayBuffer.isView(o) && !(o instanceof DataView);
}
