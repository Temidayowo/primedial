// Emails are stored lowercased, so "John@x.com" and "john@x.com" are the
// same account. Every place that reads an email from user input (signup,
// login, password reset, resend verification) normalizes it with this.
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
