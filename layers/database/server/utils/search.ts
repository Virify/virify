import { hash as generateHash } from "ohash";

/**
 * Stores a search body in server-side storage under a generated hash key.
 * Returns the hash key so the caller can include it in the response.
 *
 * The body is stored without the `hash` field so that replaying via the
 * hash endpoint produces a clean request body.
 */
export async function storeSearchHash(
  body: Record<string, unknown>,
  hashInput: Record<string, unknown>,
): Promise<string> {
  const { hash: _discarded, ...bodyToStore } = body;
  const hashKey = generateHash(hashInput);
  const storage = useStorage();
  await storage.setItem(`search:${hashKey}`, bodyToStore);
  return hashKey;
}
