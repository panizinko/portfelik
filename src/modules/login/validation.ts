import type { TFunction } from "i18next";

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns An error message if invalid, undefined if valid
 */
export const validateEmail = (
  email: string,
  t: TFunction,
): string | undefined => {
  if (!email) {
    return t("login.emailRequired");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return t("login.emailInvalid");
  }
  return undefined;
};

/**
 * Validates a password
 * @param password The password to validate
 * @returns An error message if invalid, undefined if valid
 */
export const validatePassword = (
  password: string,
  t: TFunction,
): string | undefined => {
  if (!password) {
    return t("login.passwordRequired");
  }
  if (password.length < 6) {
    return t("login.passwordInvalid");
  }
  return undefined;
};
