// Email verification and password reset share Auth.js's VerificationToken
// table. Each purpose gets its own identifier prefix so issuing one kind
// of link never deletes the other, and a token can only be redeemed by
// the flow it was issued for.
export const VERIFY_PREFIX = "verify:";
export const RESET_PREFIX = "reset:";

export const verifyIdentifier = (email: string) => `${VERIFY_PREFIX}${email}`;
export const resetIdentifier = (email: string) => `${RESET_PREFIX}${email}`;

// Returns the email a verification token belongs to, or null if the token
// was issued for something else. Tokens created before prefixes existed
// have the bare email as identifier and were always verification tokens.
export function emailFromVerifyIdentifier(identifier: string) {
  if (identifier.startsWith(VERIFY_PREFIX)) return identifier.slice(VERIFY_PREFIX.length);
  if (identifier.startsWith(RESET_PREFIX)) return null;
  return identifier;
}

export function emailFromResetIdentifier(identifier: string) {
  return identifier.startsWith(RESET_PREFIX) ? identifier.slice(RESET_PREFIX.length) : null;
}
