import { describe, it, expect } from 'vitest';

/**
 * Re-implements the URL-parsing logic from getR2BucketName() in isolation so it
 * can be unit-tested without a Nuxt runtime context.
 */
function parseBucketName(raw: string): string {
  try {
    return new URL(raw).pathname.split('/').filter(Boolean).at(-1) ?? raw;
  } catch {
    return raw;
  }
}

describe('R2 bucket name parsing', () => {
  describe('when CF_R2_BUCKET is a full URL', () => {
    it('extracts the last path segment as the bucket name', () => {
      expect(parseBucketName('https://7edb117d0855bc0437c7b7f6d665d4c8.r2.cloudflarestorage.com/user')).toBe('user');
    });

    it('handles a URL with multiple path segments and returns the last', () => {
      expect(parseBucketName('https://example.r2.cloudflarestorage.com/org/my-bucket')).toBe('my-bucket');
    });

    it('handles a URL with a trailing slash by ignoring the empty segment', () => {
      expect(parseBucketName('https://example.r2.cloudflarestorage.com/user/')).toBe('user');
    });

    it('returns the raw value if the URL has no path segments', () => {
      const raw = 'https://example.r2.cloudflarestorage.com';
      expect(parseBucketName(raw)).toBe(raw);
    });
  });

  describe('when CF_R2_BUCKET is a plain bucket name', () => {
    it('returns the name unchanged', () => {
      expect(parseBucketName('my-bucket')).toBe('my-bucket');
    });

    it('returns a bucket name with hyphens unchanged', () => {
      expect(parseBucketName('virify-user-media')).toBe('virify-user-media');
    });
  });
});
