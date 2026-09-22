// verifySession() (used throughout the payment actions) redirects to
// /login by throwing Next's special NEXT_REDIRECT error - per Next's own
// docs that has to propagate uncaught or the redirect never happens. Any
// client component that wraps a server action call in try/catch needs to
// re-throw past this check, or an expired session turns into a bogus
// generic error message instead of a redirect to login.
export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}
