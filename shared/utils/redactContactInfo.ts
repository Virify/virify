/**
 * Redacts phone numbers and email addresses from user-supplied text.
 *
 * Phone numbers: any sequence that looks like a UK/international mobile or
 * landline (7–15 digits, optionally with spaces, dashes, parentheses, or a
 * leading +) is replaced digit-for-digit with `*`.
 *
 * Emails: replaced with `*******@***.**` regardless of length.
 */

const PHONE_REGEX = /(\+?[\d][\d\s\-().]{6,}[\d])/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

/**
 * Redact phone numbers and email addresses from a single string.
 */
export function redactString(text: string): string {
  if (!text || typeof text !== 'string') return text;

  return text
    .replace(EMAIL_REGEX, (match) => {
      const atIndex = match.indexOf('@');
      if (atIndex === -1) return match;
      const local = match.slice(0, atIndex);
      const domain = match.slice(atIndex + 1);
      const dotIndex = domain.lastIndexOf('.');
      const domainName = dotIndex === -1 ? domain : domain.slice(0, dotIndex);
      const tld = dotIndex === -1 ? '' : domain.slice(dotIndex + 1);
      const redactedLocal = '*'.repeat(Math.min(local.length, 7));
      const redactedDomain = '*'.repeat(Math.min(domainName.length, 3));
      const redactedTld = '*'.repeat(Math.min(tld.length, 2));
      return `${redactedLocal}@${redactedDomain}.${redactedTld}`;
    })
    .replace(PHONE_REGEX, (match) => match.replace(/\d/g, '*'));
}

/**
 * Recursively walks any plain object / array and redacts all string values.
 * Non-string, non-object values are returned unchanged.
 */
export function redactDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return redactString(value) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map(redactDeep) as unknown as T;
  }

  if (value instanceof Date) {
    return value;
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = redactDeep(val);
    }
    return result as T;
  }

  return value;
}
