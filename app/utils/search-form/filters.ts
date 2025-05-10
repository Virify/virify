/**
 * Formats features to post.
 *
 * @param propertyFeatures Array of features with `key` and `group`.
 * @param formData FormData object from the form.
 * @returns Array of formatted features.
 */
export function formatFeatures(propertyFeatures: { key: string; group: string }[], formData: FormData | undefined): { group: string; key: string }[] {
  return propertyFeatures
    .map(({ key, group }) => {
      const keyValue = formData?.get(key);
      if (keyValue) {
        return { group, key };
      }
      return null;
    })
    .filter(Boolean) as { group: string; key: string }[];
}

/**
 * Formats property types to post.
 *
 * @param propertyTypes Array of property types with `name`.
 * @param formData FormData object from the form.
 * @returns Array of selected property types.
 */
export function formatPropertyTypes(propertyTypes: { name: string }[], formData: FormData | undefined): string[] {
  return propertyTypes.map(({ name }) => formData?.get(name)).filter(Boolean) as string[];
}

/**
 * Normalizes a range to ensure min is less than or equal to max.
 *
 * @param range Tuple of [min, max].
 * @returns Normalized range.
 */
export function normalizeRange(range: [number, number]): [number, number] {
  const [min, max] = range;
  return min > max ? [max, min] : [min, max];
}

/**
 * Extracts form data for specific fields.
 *
 * @param formData FormData object from the form.
 * @param fieldNames Array of field names to extract.
 * @returns Object with field names as keys and their values as strings or null.
 */
export function extractFormData(formData: FormData | undefined, fieldNames: string[]): Record<string, string | null> {
  return fieldNames.reduce((acc, fieldName) => {
    const value = formData?.get(fieldName);
    acc[fieldName] = typeof value === "string" ? value : null;
    return acc;
  }, {} as Record<string, string | null>);
}
