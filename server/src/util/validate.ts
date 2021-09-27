/**
 * Returns true if username is valid.
 *
 * A username is valid if its' length is between 1 and 30 characters.
 */
export function isValidUsername(username: string): boolean {
  return username.length > 0 && username.length <= 30
}

/**
 * Returns true if email is valid.
 *
 * Actual validation is done by sending an email. This method merely checks
 * that email is not an empty string.
 *
 * DO NOT rely solely on this to confirm that a user gave a valid email.
 */
export function isValidEmail(email: string): boolean {
  return email.length > 0
}

/**
 * Returns true if password is valid.
 *
 * A password is valid if its' length is at least 10 characters.
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 10
}
