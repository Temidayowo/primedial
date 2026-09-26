// Record ids are Postgres uuids. An id taken from a URL has to be checked
// before it reaches a query - Postgres rejects a malformed uuid with an
// error, which would crash the page instead of showing a 404.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
