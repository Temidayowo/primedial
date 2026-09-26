// Server actions return failures as values instead of throwing them.
// Next.js strips the message from any error thrown by a server action in
// production (the client only gets a digest), so a thrown "Incorrect OTP"
// or "Card declined" would reach the customer as a generic failure.
export type ActionResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

export function actionError(error: string): { ok: false; error: string } {
  return { ok: false, error };
}
