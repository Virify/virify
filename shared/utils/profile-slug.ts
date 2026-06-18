/**
 * Converts a username/display name to a URL-safe profile slug.
 * Strips non-alphanumeric characters and converts to kebab-case.
 * e.g. "Watson-Whittaker & Co. Estates" → "watson-whittaker-co-estates"
 */
export function toProfileSlug(name: string | null | undefined): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
