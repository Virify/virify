export function isError(err: unknown): err is typeof Error {
  return !!err && err instanceof Error
}